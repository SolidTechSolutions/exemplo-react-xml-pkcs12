import { useState } from 'react';
import './App.css';

// [PT-BR] Exemplo de front-end React para assinatura XML/XAdES com certificado
// PKCS#12 (arquivo .pfx/.p12 já importado na SolidSign API — este app não faz
// a importação, só a assinatura). Reaproveita a lógica de campos/parâmetros
// da tela "Assinar XML" do Portal SolidSign (src/pages/Signer/SignerXML.jsx),
// cortando tudo que não é específico deste método: sem login/AuthContext, sem
// i18n, sem múltiplos node IDs/nomes/namespaces (o backend de exemplo aceita
// só um de cada), sem importação de certificado.
//
// [EN] React front-end example for XML/XAdES signing with a PKCS#12
// certificate (a .pfx/.p12 already imported in the SolidSign API — this app
// only signs, it does not import). Reuses the field/parameter logic from the
// Portal SolidSign "Sign XML" screen (src/pages/Signer/SignerXML.jsx),
// trimmed of everything not specific to this method: no login/AuthContext,
// no i18n, no multiple node IDs/names/namespaces (the example backend only
// accepts one of each), no certificate import.
//
// Este front-end fala com o backend de exemplo local (porta padrão 8080),
// nunca diretamente com a SolidSign API.
// This front-end talks to the local example backend (default port 8080),
// never directly to the SolidSign API.

const BACKEND_URL = 'http://localhost:8080/api/xml/sign/form';

const PROFILES = ['ADRB', 'ADRT', 'ADRC', 'ADRA', 'XADES_B', 'XADES_T', 'XADES_LT', 'XADES_LTA'];

export default function App() {
  const [baseUrl, setBaseUrl] = useState('https://www.solidsign.com.br');
  const [authorization, setAuthorization] = useState('');
  const [pfxCode, setPfxCode] = useState('');
  const [documents, setDocuments] = useState([]);

  const [profile, setProfile] = useState('ADRB');
  const [hashAlgorithm, setHashAlgorithm] = useState('SHA256');
  const [signaturePackaging, setSignaturePackaging] = useState('ENVELOPED');
  const [canonicalizationMethod, setCanonicalizationMethod] = useState('EXCLUSIVE');
  const [signatureNodeName, setSignatureNodeName] = useState('document');
  const [signatureNodeNamespace, setSignatureNodeNamespace] = useState('');
  const [signatureNodeId, setSignatureNodeId] = useState('');
  const [isRemoveXPathExclusionFilter, setIsRemoveXPathExclusionFilter] = useState(false);
  const [isRemoveNamespacePrefixFromNodeNames, setIsRemoveNamespacePrefixFromNodeNames] = useState(false);
  const [isSignKeyInfo, setIsSignKeyInfo] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (documents.length === 0) { setError('Selecione ao menos um documento XML.'); return; }
    if (!pfxCode.trim()) { setError('Informe o pfxCode do certificado já importado.'); return; }
    if (!authorization.trim()) { setError('Informe o token de autorização (Bearer).'); return; }

    setLoading(true);
    try {
      const fd = new FormData();
      documents.forEach((f) => fd.append('document', f));
      fd.append('authorization', authorization.startsWith('Bearer ') ? authorization : `Bearer ${authorization}`);
      fd.append('baseUrl', baseUrl);
      fd.append('pfxCode', pfxCode);
      fd.append('profile', profile);
      fd.append('hashAlgorithm', hashAlgorithm);
      fd.append('signaturePackaging', signaturePackaging);
      fd.append('canonicalizationMethod', canonicalizationMethod);
      if (signatureNodeName.trim()) fd.append('signatureNodeName', signatureNodeName.trim());
      if (signatureNodeNamespace.trim()) fd.append('signatureNodeNamespace', signatureNodeNamespace.trim());
      if (signatureNodeId.trim()) fd.append('signatureNodeId', signatureNodeId.trim());
      fd.append('isRemoveXPathExclusionFilter', String(isRemoveXPathExclusionFilter));
      fd.append('isRemoveNamespacePrefixFromNodeNames', String(isRemoveNamespacePrefixFromNodeNames));
      fd.append('isSignKeyInfo', String(isSignKeyInfo));

      // O backend de exemplo assina, baixa os .xml resultantes da SolidSign API
      // e devolve um único ZIP binário pronto (não um JSON com links).
      const res = await fetch(BACKEND_URL, { method: 'POST', body: fd });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        let msg = text;
        try { msg = JSON.parse(text)?.message || text; } catch { /* keep raw text */ }
        setError(msg || `Erro HTTP ${res.status}`);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResult({ url, count: documents.length });
    } catch (err) {
      setError(`Falha ao chamar o backend de exemplo em ${BACKEND_URL} — ele está rodando? (${err.message})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Assinar XML/XAdES — PKCS#12 (exemplo React)</h1>
      <p className="subtitle">
        Front-end de exemplo para o back-end <code>exemplo-java-integracao-xml-pkcs12</code>.
        Certificado deve já estar importado na SolidSign API (endpoint
        <code>POST /solidsign/dsig/certificates/pkcs12/import</code>) — este exemplo
        só demonstra a etapa de assinatura.
      </p>

      <form onSubmit={submit} className="form">
        <fieldset>
          <legend>1. Conexão com a SolidSign API</legend>
          <label>Base URL da API
            <input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://www.solidsign.com.br" />
          </label>
          <label>Token de autorização (Bearer)
            <input value={authorization} onChange={(e) => setAuthorization(e.target.value)} placeholder="eyJhbGciOi..." />
          </label>
        </fieldset>

        <fieldset>
          <legend>2. Documento e certificado</legend>
          <label>Documento(s) XML
            <input type="file" accept=".xml,text/xml,application/xml" multiple onChange={(e) => setDocuments(Array.from(e.target.files))} />
          </label>
          <label>pfxCode (id do certificado já importado)
            <input value={pfxCode} onChange={(e) => setPfxCode(e.target.value)} placeholder="a1b2c3d4-e5f6-7890-abcd-ef1234567890" />
          </label>
        </fieldset>

        <fieldset>
          <legend>3. Nó XML a assinar</legend>
          <div className="grid2">
            <label>Nome do nó (signatureNodeName)
              <input value={signatureNodeName} onChange={(e) => setSignatureNodeName(e.target.value)} placeholder="document" />
            </label>
            <label>Namespace do nó (opcional)
              <input value={signatureNodeNamespace} onChange={(e) => setSignatureNodeNamespace(e.target.value)} placeholder="http://www.example.com/doc" />
            </label>
          </div>
          <label>ID específico do nó (opcional — se preenchido, tem prioridade sobre nome/namespace)
            <input value={signatureNodeId} onChange={(e) => setSignatureNodeId(e.target.value)} placeholder="deixe em branco para assinar por nome/namespace" />
          </label>
        </fieldset>

        <fieldset>
          <legend>4. Parâmetros de assinatura</legend>
          <div className="grid2">
            <label>Perfil
              <select value={profile} onChange={(e) => setProfile(e.target.value)}>
                {PROFILES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
            <label>Algoritmo de hash
              <select value={hashAlgorithm} onChange={(e) => setHashAlgorithm(e.target.value)}>
                <option value="SHA256">SHA-256</option>
                <option value="SHA512">SHA-512</option>
              </select>
            </label>
            <label>Empacotamento
              <select value={signaturePackaging} onChange={(e) => setSignaturePackaging(e.target.value)}>
                <option value="ENVELOPED">ENVELOPED</option>
                <option value="ENVELOPING">ENVELOPING</option>
                <option value="DETACHED">DETACHED</option>
              </select>
            </label>
            <label>Canonicalização
              <select value={canonicalizationMethod} onChange={(e) => setCanonicalizationMethod(e.target.value)}>
                <option value="EXCLUSIVE">EXCLUSIVE</option>
                <option value="EXCLUSIVE_WITH_COMMENTS">EXCLUSIVE WITH COMMENTS</option>
                <option value="INCLUSIVE">INCLUSIVE</option>
                <option value="INCLUSIVE_WITH_COMMENTS">INCLUSIVE WITH COMMENTS</option>
              </select>
            </label>
          </div>
          <label className="checkbox-row">
            <input type="checkbox" checked={isRemoveXPathExclusionFilter} onChange={(e) => setIsRemoveXPathExclusionFilter(e.target.checked)} />
            Remover filtro de exclusão XPath
          </label>
          <label className="checkbox-row">
            <input type="checkbox" checked={isRemoveNamespacePrefixFromNodeNames} onChange={(e) => setIsRemoveNamespacePrefixFromNodeNames(e.target.checked)} />
            Remover prefixo de namespace dos nomes de nó
          </label>
          <label className="checkbox-row">
            <input type="checkbox" checked={isSignKeyInfo} onChange={(e) => setIsSignKeyInfo(e.target.checked)} />
            Incluir elemento KeyInfo na assinatura
          </label>
        </fieldset>

        <button type="submit" disabled={loading}>{loading ? 'Assinando…' : 'ASSINAR DOCUMENTOS'}</button>
      </form>

      {error && <div className="box error">{error}</div>}

      {result && (
        <div className="box success">
          <h3>Sucesso!</h3>
          <p>{result.count} documento(s) assinado(s).</p>
          <a href={result.url} download="signed_xml.zip" className="download-btn">Baixar ZIP com o(s) .xml assinado(s)</a>
        </div>
      )}
    </div>
  );
}
