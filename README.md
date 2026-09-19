# 🇧🇷 SolidSign API - Front-end de Exemplo: Assinatura XML/XAdES com PKCS#12 (React)

Este projeto é a contrapartida visual do back-end [`exemplo-java-integracao-xml-pkcs12`](https://github.com/SolidTechSolutions/exemplo-java-integracao-xml-pkcs12). Reaproveita a lógica de campos e parâmetros da tela **Assinar XML** do Portal SolidSign, simplificada: sem login, sem i18n, sem importação de certificado (o `pfxCode` já deve existir) e sem múltiplos node IDs/nomes/namespaces por documento (o back-end de exemplo aceita apenas um de cada, aplicado a todos os arquivos enviados).

## Como funciona

Este front-end **não fala diretamente com a SolidSign API** — ele fala com o back-end de exemplo local, que expõe um endpoint de formulário com CORS liberado (`POST /api/xml/sign/form`) e repassa `authorization`/`baseUrl` que você preenche no formulário. O back-end assina, baixa os `.xml` resultantes e devolve um único `.zip` pronto pra download.

## Pré-requisitos

1. Rode o back-end [`exemplo-java-integracao-xml-pkcs12`](https://github.com/SolidTechSolutions/exemplo-java-integracao-xml-pkcs12) localmente (`mvn spring-boot:run`, porta padrão `8080`).
2. Tenha um token JWT válido e um certificado PKCS#12 já importado (`POST /solidsign/dsig/certificates/pkcs12/import`) — o `id` retornado é o `pfxCode`.
3. Saiba o nome (e, se houver, o namespace) do nó XML que deve ser assinado no(s) seu(s) documento(s).

## Rodando

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`, preencha o formulário e assine.

---

# 🇬🇧 SolidSign API - Example Front-end: XML/XAdES Signing with PKCS#12 (React)

This project is the visual counterpart to the [`exemplo-java-integracao-xml-pkcs12`](https://github.com/SolidTechSolutions/exemplo-java-integracao-xml-pkcs12) backend. It reuses the field/parameter logic from the Portal SolidSign **Sign XML** screen, simplified: no login, no i18n, no certificate import (the `pfxCode` must already exist) and no multiple node IDs/names/namespaces per document (the example backend only accepts one of each, applied to every uploaded file).

## How it works

This front-end **never talks directly to the SolidSign API** — it talks to the local example backend, which exposes a CORS-enabled form endpoint (`POST /api/xml/sign/form`) and forwards the `authorization`/`baseUrl` you fill in the form. The backend signs, downloads the resulting `.xml` files and returns a single ready-to-download `.zip`.

## Prerequisites

1. Run the [`exemplo-java-integracao-xml-pkcs12`](https://github.com/SolidTechSolutions/exemplo-java-integracao-xml-pkcs12) backend locally (`mvn spring-boot:run`, default port `8080`).
2. Have a valid JWT token and a PKCS#12 certificate already imported (`POST /solidsign/dsig/certificates/pkcs12/import`) — the returned `id` is the `pfxCode`.
3. Know the name (and namespace, if any) of the XML node that must be signed in your document(s).

## Running

```bash
npm install
npm run dev
```

Open `http://localhost:5173`, fill in the form and sign.
