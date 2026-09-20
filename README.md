# 🇧🇷 SolidSign API - Front-end de Exemplo: Assinatura XML com PKCS#12 (React)

## ⚠️ Disponibilidade

Este método (importação de certificado PKCS#12 direto no servidor) só está disponível em instâncias do SolidSign API rodando **on-premises** (localmente, na infraestrutura do próprio cliente). **Não está disponível na versão SaaS pública** do SolidSign.

Se você usa o SaaS público, use `sign-hsm-cloud` (com o seu próprio PSC) ou a custódia KMS SolidSign em vez deste método.

## Como funciona

Este front-end chama `POST /api/xml/sign/form` (`http://localhost:8080` por padrão) no back-end de exemplo, enviando o `pfxCode` de um certificado PKCS#12 já importado. O back-end assina o XML e devolve um `.zip`.

## Requisitos

Rode este back-end de exemplo localmente:

- **Java**: [`exemplo-java-integracao-xml-pkcs12`](https://github.com/SolidTechSolutions/exemplo-java-integracao-xml-pkcs12)

- Um token JWT válido (`POST /solidsign/auth/token`)
- Um certificado PKCS#12 já importado (`POST /solidsign/dsig/certificates/pkcs12/import`) — o `id` retornado é o `pfxCode`

## Como rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`, preencha o formulário e envie.

## Variáveis do formulário

| Campo | Significado | Default |
|---|---|---|
| `baseUrl` | URL base da SolidSign API | `https://www.solidsign.com.br` |
| `authorization` | Token JWT (Bearer) | (vazio) |
| `pfxCode` | ID do certificado PKCS#12 importado | (vazio) |
| `documents` | XML(s) a assinar | (vazio) |
| `profile` | Perfil de assinatura PBAD/ETSI | `ADRB` |
| `hashAlgorithm` | Algoritmo de hash | `SHA256` |
| `signaturePackaging` | Empacotamento XML-DSig | `ENVELOPED` |
| `canonicalizationMethod` | Método de canonicalização | `EXCLUSIVE` |
| `signatureNodeName` | Nome do nó a assinar | `document` |
| `signatureNodeNamespace` | Namespace do nó (opcional) | (vazio) |
| `signatureNodeId` | ID do nó, tem prioridade sobre nome/namespace (opcional) | (vazio) |
| `isRemoveXPathExclusionFilter` | Remover filtro de exclusão XPath | `false` |
| `isRemoveNamespacePrefixFromNodeNames` | Remover prefixo de namespace dos nomes de nó | `false` |
| `isSignKeyInfo` | Assinar o KeyInfo | `false` |

---

# 🇬🇧 SolidSign API - Example Front-end: XML Signing with PKCS#12 (React)

## ⚠️ Availability

This method (server-side PKCS#12 certificate import) is only available on **on-premises** SolidSign API instances (running locally, on the customer's own infrastructure). **It is not available on the public SaaS** version of SolidSign.

Why: PKCS#12 import keeps the decrypted private key cached on the server for up to 2 hours — an acceptable risk on your own on-premises instance, but not on a shared multi-tenant SaaS instance. If you use the public SaaS, use `sign-hsm-cloud` (your own PSC) or KMS SolidSign custody instead of this method.

## How it works

This front-end calls `POST /api/xml/sign/form` (`http://localhost:8080` by default) on the example backend, sending the `pfxCode` of an already-imported PKCS#12 certificate. The backend signs the XML and returns a `.zip`.

## Requirements

Run this example backend locally:

- **Java**: [`exemplo-java-integracao-xml-pkcs12`](https://github.com/SolidTechSolutions/exemplo-java-integracao-xml-pkcs12)

- A valid JWT token (`POST /solidsign/auth/token`)
- A PKCS#12 certificate already imported (`POST /solidsign/dsig/certificates/pkcs12/import`) — the returned `id` is the `pfxCode`

## Running

```bash
npm install
npm run dev
```

Open `http://localhost:5173`, fill in the form and submit.

## Form fields

| Field | Meaning | Default |
|---|---|---|
| `baseUrl` | SolidSign API base URL | `https://www.solidsign.com.br` |
| `authorization` | JWT (Bearer) token | (empty) |
| `pfxCode` | ID of the imported PKCS#12 certificate | (empty) |
| `documents` | XML(s) to sign | (empty) |
| `profile` | PBAD/ETSI signature profile | `ADRB` |
| `hashAlgorithm` | Hash algorithm | `SHA256` |
| `signaturePackaging` | XML-DSig packaging | `ENVELOPED` |
| `canonicalizationMethod` | Canonicalization method | `EXCLUSIVE` |
| `signatureNodeName` | Name of the node to sign | `document` |
| `signatureNodeNamespace` | Node namespace (optional) | (empty) |
| `signatureNodeId` | Node ID, takes priority over name/namespace (optional) | (empty) |
| `isRemoveXPathExclusionFilter` | Remove the XPath exclusion filter | `false` |
| `isRemoveNamespacePrefixFromNodeNames` | Remove the namespace prefix from node names | `false` |
| `isSignKeyInfo` | Sign the KeyInfo | `false` |
