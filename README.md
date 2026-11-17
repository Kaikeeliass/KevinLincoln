# Kevin Lincoln — Nutricionista

Site institucional + página de vendas do nutricionista Kevin Lincoln (CRN 83678).
Serviço oferecido: **Acompanhamento nutricional do Método Atlas** (sem duração fixa, com direcionamento
individual do Kevin). Público prioritário: quem usa canetas emagrecedoras (GLP-1).
HTML/CSS/JS estático, publicado na Vercel. Sem build: cada página é um arquivo `.html` na raiz.

## Páginas

| Arquivo | Papel |
| --- | --- |
| `index.html` | Home / landing page: venda do acompanhamento, focada em quem usa canetas |
| `metodo-atlas.html` | Página do Método Atlas e do que está incluso (`#planos`) |
| `sobre.html` | História, princípios e credenciais do Kevin |
| `resultados.html` | Depoimentos (com filtro) e trajetória |
| `duvidas.html` | Central de dúvidas com busca, categorias e link direto por pergunta |
| `contato.html` | Formulário completo + canais de contato |
| `404.html` | Página de erro |

URLs antigas têm redirect 301 no `vercel.json`: `historia.html` → `sobre.html`; o Desafio Atlas Start
(descontinuado), `acompanhamentos.html`, `projeto-24-dias.html`, `metodo-atlas-start.html` e
`acompanhamento-premium.html` → `metodo-atlas.html`.

## Estrutura

- `css/style.css` — design system (tokens no `:root`, componentes e responsividade no fim do arquivo).
- `js/main.js` — menu, modal, formulário (EmailJS + confirmação no WhatsApp), FAQ, filtros, CTA fixo no mobile.
- `img/site/` — imagens otimizadas usadas pelo site (WebP + JPG em várias larguras, favicons, OG image).
  As imagens originais em `img/` e `img/img_hist/` foram mantidas, mas não são mais carregadas pelo site.

## Como editar

- **Botão que abre o formulário:** qualquer elemento com `data-open-form` abre o modal.
  O lead chega no EmailJS com `servico_desejado = "Acompanhamento nutricional"`.
- **Nova foto:** gere versões `nome-480/800/1200.webp` (+ `.jpg`) em `img/site/` e use `<picture>`
  com `srcset`, `width`/`height` e `loading="lazy"` (só a foto do topo usa `fetchpriority="high"`).
- **SEO:** cada página tem title, description, canonical, Open Graph e JSON-LD (`@graph` com
  WebSite, MedicalBusiness, Person, WebPage, BreadcrumbList e, quando faz sentido, Service e FAQPage).
  Ao criar uma página nova, adicione-a ao `sitemap.xml`.

## Regras de conteúdo

- Não informar duração fixa do acompanhamento.
- Canetas emagrecedoras: não citar marcas comerciais nem orientar dose/uso; o Kevin não prescreve
  medicamentos (ver aviso em `metodo-atlas.html#planos` e nas dúvidas).
