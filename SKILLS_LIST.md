# Firstsun Skill Arsenal - 技能清單 (Skill List)

本文件列出了當前在庫存（Arsenal）中的所有 AI Agent 技能，包含中文說明與檔案連結。

## 🛠️ 基礎工具 (Basic Tools)
| 技能名稱 | 中文說明 | 檔案連結 |
| :--- | :--- | :--- |
| **skill-manager** | 管理 `custom/` 與 `external/` 領域的維護指南，並支持匯出為 Gemini Gem 指令集。 | [SKILL.md](./custom/basic/skill-manager/SKILL.md) |
| **firstsun-project-init** | 新專案一站式初始化流程：挑選並安裝相關技能、透過 harness-creator 建立代理 harness、建立 firstsun-dev org 下的 GitHub repo 並設定描述/tags、更新組織 profile README。 | [SKILL.md](./custom/basic/firstsun-project-init/SKILL.md) |
| **firstsun-pm** | firstsun-dev 組織的專案管理技能：跨 repo 統一 issue 建立規範，依 repo 路由至對應 Project Board（多數 repo → #6，heaven-monorepo/heaven-www → #8，兩者欄位/慣例一致）、強制命名慣例，並協助設定 Estimate/Priority 欄位。 | [SKILL.md](./custom/basic/firstsun-pm/SKILL.md) |
| **skill-creator** | 創建有效技能的指南，包含工作流與工具整合. | [SKILL.md](./external/basic/skill-creator/SKILL.md) |
| **validate-skills** | 驗證技能是否符合 agentskills.io 規範與最佳實踐。 | [SKILL.md](./external/basic/validate-skills/SKILL.md) |
| **find-skills** | 幫助使用者發現並安裝適合的 AI 技能。 | [SKILL.md](./external/basic/find-skills/SKILL.md) |
| **documentation-writer** | Diátaxis 文檔專家，用於撰寫高品質技術文件。 | [SKILL.md](./external/basic/documentation-writer/SKILL.md) |
| **brainstorming** | 在執行創意工作前的需求探索與設計思考工具。 | [SKILL.md](./external/basic/brainstorming/SKILL.md) |
| **firecrawl-search** | 具備完整網頁內容提取功能的網路搜尋工具。 | [SKILL.md](./external/basic/firecrawl-search/SKILL.md) |
| **book-distiller** | 萬用書籍萃取系統：將 PDF、EPUB、TXT 轉化為 AI 技能或 Gem 指令。 | [SKILL.md](./custom/basic/book-distiller/SKILL.md) |
| **full-output-enforcement** | 強制完整代碼生成，禁用佔位符模式，並乾淨處理 Token 限制拆分。 | [SKILL.md](./external/basic/full-output-enforcement/SKILL.md) |
| **harness-creator** | 建立、稽核與改善 AI 編碼代理的 Harness：CLAUDE.md 指令檔、狀態追蹤、驗證關卡、作業階段交接與多代理協作。 | [SKILL.md](./external/basic/harness-creator/SKILL.md) |

## 🤖 AI Agent 開發 (AI Agent Development)
| 技能名稱 | 中文說明 | 檔案連結 |
| :--- | :--- | :--- |
| **subagent-creator** | 指導如何建立具備獨立上下文的 AI subagent（specialized agent、verifier、debugger、orchestrator）。 | [SKILL.md](./external/ai-agents/subagent-creator/SKILL.md) |
| **subagent-driven-development** | 透過為每個任務派發全新 implementer subagent + spec/品質雙重審查來執行實作計畫。⚠️ 已知限制：純 upstream 鏡像，內文引用的 `../requesting-code-review/code-reviewer.md` 在本 repo 未安裝，會斷鏈；若需完整最終審查流程，另外安裝 `requesting-code-review` skill（`npx skills add obra/superpowers -s requesting-code-review`）。 | [SKILL.md](./external/ai-agents/subagent-driven-development/SKILL.md) |

## 💎 Gem 指令集 (Gem Instructions)
這些是將多個相關技能整合後的 Google Gemini Gem 專用指令集，可直接複製到 Gemini 的「操作說明」中使用。

| 名稱 | 說明 | 檔案連結 |
| :--- | :--- | :--- |
| **lifestyle** | 綜合生活架構師：整合健康、學習與思考的萬用 Gem。 | [lifestyle.txt](./gem/lifestyle.txt) |
| **health** | 健康戰略家：專注於生物優化、營養與體能管理。 | [health.txt](./gem/health.txt) |
| **learning** | 學習教練：專注於加速學習、記憶與技能習得。 | [learning.txt](./gem/learning.txt) |
| **thinking** | 思維戰略家：專注於第一性原理、邏輯批判與結構化思考。 | [thinking.txt](./gem/thinking.txt) |
| **video-design** | 影片設計與自動化：專注於 Remotion 程式化影片生成與宣傳圖影。 | [video-design.txt](./gem/video-design.txt) |

## 💻 開發開發 (Development)

### 前端與規約 (Frontend & Conventions)
| 技能名稱 | 中文說明 | 檔案連結 |
| :--- | :--- | :--- |
| **firstsun-dev-conventions** | Firstsun 專案的綜合開發規範 (Astro, React, Cloudflare)，包含後端、樣式、i18n 與測試。 | [SKILL.md](./custom/develop/firstsun-dev-conventions/SKILL.md) |
| **astro-cloudflare-backend** | 使用 D1, Drizzle ORM 與 Astro Actions 構建 Astro/Cloudflare 後端的最佳實踐。 | [SKILL.md](./custom/develop/astro-cloudflare-backend/SKILL.md) |
| **astro-scss-best-practices** | 在 Astro 專案中使用 SCSS Modules 與設計令牌的樣式最佳實踐。 | [SKILL.md](./custom/develop/astro-scss-best-practices/SKILL.md) |
| **frontend-design** | 創作具備高品質設計感的生產級前端介面。 | [SKILL.md](./external/develop/frontend/frontend-design/SKILL.md) |
| **react** | 將 JSON 規格轉換為 React 組件的渲染器。 | [SKILL.md](./external/develop/frontend/react/SKILL.md) |
| **react-best-practices** | 撰寫或閱讀 React 組件時的最佳實踐指南。 | [SKILL.md](./external/develop/frontend/react-best-practices/SKILL.md) |
| **vercel-react-best-practices** | Vercel 工程團隊提供的 React/Next.js 效能最佳化指南。 | [SKILL.md](./external/develop/frontend/vercel-react-best-practices/SKILL.md) |
| **best-practices** | 現代網頁開發的安全性、相容性與程式碼品質標準。 | [SKILL.md](./external/develop/frontend/best-practices/SKILL.md) |
| **design-taste-frontend** | 反「Slop（水代碼）」前端開發，針對登陸頁、作品集及重新設計提供優質無範本的介面與設計系統。 | [SKILL.md](./external/develop/frontend/design-taste-frontend/SKILL.md) |
| **design-taste-frontend-v1** | 原始 v1 taste-skill，用於向後相容。 | [SKILL.md](./external/develop/frontend/design-taste-frontend-v1/SKILL.md) |
| **gpt-taste** | 精英級 UX/UI 與高級 GSAP 動畫工程，強制執行佈局隨機化、ScrollTrigger 滾動觸發及寬鬆版式。 | [SKILL.md](./external/develop/frontend/gpt-taste/SKILL.md) |
| **high-end-visual-design** | 頂尖機構級 UI/UX 設計與動畫，定義字體、間距、陰影等，避免廉價 AI 設計默認值。 | [SKILL.md](./external/develop/frontend/high-end-visual-design/SKILL.md) |
| **image-to-code** | 視覺優先的網頁設計與代碼實現，先生成設計參考圖再轉化為精確前端代碼。 | [SKILL.md](./external/develop/frontend/image-to-code/SKILL.md) |
| **industrial-brutalist-ui** | 工業粗獷主義與戰術遙測介面工程，融合瑞士排版、製造手冊與復古終端美學。 | [SKILL.md](./external/develop/frontend/industrial-brutalist-ui/SKILL.md) |
| **minimalist-ui** | 極簡主義與社論風格介面，採用暖單色調調色板與扁平 Bento 格局。 | [SKILL.md](./external/develop/frontend/minimalist-ui/SKILL.md) |
| **redesign-existing-projects** | 現有網頁與應用的重構設計與升級，識別並消除通用 AI 模式，提升介面質感。 | [SKILL.md](./external/develop/frontend/redesign-existing-projects/SKILL.md) |
| **sleek-design-mobile-apps** | 行動應用設計與 UI 實現，支持與 Sleek 專案對接（建立畫面、互動與列出專案）。 | [SKILL.md](./external/develop/frontend/sleek-design-mobile-apps/SKILL.md) |
| **stitch-design-taste** | Google Stitch 語意設計系統，生成適用於 Stitch 畫面生成的 DESIGN.md 設計規範。 | [SKILL.md](./external/develop/frontend/stitch-design-taste/SKILL.md) |
| **visual-design-foundations** | 提供對比、對齊、重複、親密性（C.R.A.P. 原則）、色彩學與排版布局等視覺設計的核心基礎規範。 | [SKILL.md](./external/develop/frontend/visual-design-foundations/SKILL.md) |
| **tailwind-css-patterns** | 包含許多熱門的 Tailwind CSS 設計樣式與佈局，能快速套用現代化網頁的設計模式。 | [SKILL.md](./external/develop/frontend/tailwind-css-patterns/SKILL.md) |
| **ui-animation** | 針對 UI 元件互動（如按鈕懸停、彈出視窗、列表加載等）設計自然流暢的微動效。 | [SKILL.md](./external/develop/frontend/ui-animation/SKILL.md) |
| **threejs-animation** | 專門用於 WebGL/Three.js 的 3D 視覺場景建模與 3D 動畫設計。 | [SKILL.md](./external/develop/frontend/threejs-animation/SKILL.md) |

### 程式碼品質與規範 (Code Quality & Standards)
| 技能名稱 | 中文說明 | 檔案連結 |
| :--- | :--- | :--- |
| **clean-code** | 依 Robert C. Martin《Clean Code》原則指導命名、函式、註解、格式與錯誤處理，適用於寫新程式碼、審查 PR 或重構。 | [SKILL.md](./external/develop/code-quality/clean-code/SKILL.md) |
| **write-coding-standards-from-file** | 讀取現有程式碼檔案/資料夾的風格，自動產生專案的 coding standards 文件（如 STYLE.md）。 | [SKILL.md](./external/develop/code-quality/write-coding-standards-from-file/SKILL.md) |

### 後端與 Cloudflare (Backend & Cloudflare)
| 技能名稱 | 中文說明 | 檔案連結 |
| :--- | :--- | :--- |
| **workers-best-practices** | Cloudflare Workers 生產環境最佳實踐與程式碼審查。 | [SKILL.md](./custom/develop/workers-best-practices/SKILL.md) |
| **d1-drizzle-schema** | Drizzle ORM 於 D1 上的欄位設計模式與遷移流程。 | [SKILL.md](./custom/develop/d1-drizzle-schema/SKILL.md) |
| **cloudflare** | Cloudflare 全方位服務管理，涵蓋 Workers, KV, R2, D1, AI 與安全性配置。 | [SKILL.md](./external/develop/devops/cloudflare/SKILL.md) |
| **windmill-rust-backend** | Windmill 後端 Rust 編碼規範，撰寫或修改 backend/ 目錄下的 Rust 程式碼時必用。 | [SKILL.md](./external/develop/windmill-rust-backend/SKILL.md) |

### 運維、架構與工具 (DevOps, Architecture & Tools)
| 技能名稱 | 中文說明 | 檔案連結 |
| :--- | :--- | :--- |
| **monorepo-management** | 使用 Turborepo/Nx/pnpm 管理大規模 Monorepo 的架構指南。 | [SKILL.md](./custom/develop/monorepo-management/SKILL.md) |
| **gitlab-ci-patterns** | 高效率 GitLab CI/CD 流水線配置與自動化部署模式。 | [SKILL.md](./custom/develop/gitlab-ci-patterns/SKILL.md) |
| **playwright-best-practices** | Playwright E2E 測試架構、POM 模式與 CI 整合。 | [SKILL.md](./external/develop/devops/playwright-best-practices/SKILL.md) |
| **devops-engineer** | Docker, CI/CD, Kubernetes, Terraform 等自動化配置。 | [SKILL.md](./external/develop/devops/devops-engineer/SKILL.md) |
| **gcloud** | Google Cloud SDK 管理與雲端資源配置 CLI 操作。 | [SKILL.md](./external/develop/devops/gcloud/SKILL.md) |
| **oracle-cloud** | Oracle Cloud Infrastructure (OCI) 雲端資源配置與架構指引。 | [SKILL.md](./external/develop/devops/oracle-cloud/SKILL.md) |
| **gh-cli** | GitHub CLI (gh) 的完整操作參考手冊。 | [SKILL.md](./external/develop/devops/gh-cli/SKILL.md) |
| **github-actions** | 現代化 Monorepo CI/CD 模式：路徑過濾、自動化發佈與 Cloudflare 部署。 | [SKILL.md](./custom/develop/github-actions/SKILL.md) |
| **using-git-worktrees** | 使用 Git Worktree 隔離不同功能的開發環境。 | [SKILL.md](./external/develop/devops/using-git-worktrees/SKILL.md) |
| **terraform-engineer** | 專門為 Terraform 工程師設計的技能，涵蓋資源配置與架構建議。 | [SKILL.md](./external/develop/devops/terraform-engineer/SKILL.md) |

### 國際化 (i18n)
| 技能名稱 | 中文說明 | 檔案連結 |
| :--- | :--- | :--- |
| **i18n** | 使用 react-i18next 進行多國語言翻譯與管理的指南。 | [SKILL.md](./external/develop/internationalization-i18n/SKILL.md) |

### 🛡️ 安全 (Security)
| 技能名稱 | 中文說明 | 檔案連結 |
| :--- | :--- | :--- |
| **security-scan** | 掃描 AI Agent 配置中的安全性漏洞與風險。 | [SKILL.md](./external/develop/security/security-scan/SKILL.md) |
| **owasp-security** | 遵循 OWASP Top 10 的安全編碼實踐。 | [SKILL.md](./external/develop/security/owasp-security/SKILL.md) |
| **secret-scanning** | 管理 GitHub 密鑰掃描、推送保護與修復。 | [SKILL.md](./external/develop/security/secret-scanning/SKILL.md) |


## ✍️ 內容創作 (Writing)
| 技能名稱 | 中文說明 | 檔案連結 |
| :--- | :--- | :--- |
| **blog-master** | 全方位部落格管理：包含中文潤稿優化 (GEO 標準) 與自動化中翻英翻譯。 | [SKILL.md](./custom/writing/blog-master/SKILL.md) |
| **polish-blog** | 潤飾與完善 Astro 部落格的中文文章，處理語言流暢度、參考連結與 SEO 屬性。 | [SKILL.md](./custom/writing/polish-blog/SKILL.md) |
| **translate-blog** | 部落格文章中翻英：將中文文章翻譯為英文，自動轉換 frontmatter 欄位並鏡像儲存至對應目錄。 | [SKILL.md](./custom/writing/translate-blog/SKILL.md) |

## 💜 Obsidian 知識管理 (Obsidian Management)
| 技能名稱 | 中文說明 | 檔案連結 |
| :--- | :--- | :--- |
| **obsidian-bases** | 建立與編輯 Obsidian Bases 視圖、過濾器與資料庫公式。 | [SKILL.md](./custom/obsidian/obsidian-bases/SKILL.md) |
| **obsidian-markdown** | 使用 Obsidian 專屬語法 (雙鏈、Callouts、Properties) 進行寫作。 | [SKILL.md](./custom/obsidian/obsidian-markdown/SKILL.md) |
| **obsidian-development** | Obsidian 插件開發指南 (TDD, API 規範)。 | [SKILL.md](./custom/obsidian/obsidian-development/SKILL.md) |

## 🎬 影片設計 (Video Design)
| 技能名稱 | 中文說明 | 檔案連結 |
| :--- | :--- | :--- |
| **remotion** | 使用 React (Remotion) 生成具備平滑過渡效果的影片。 | [SKILL.md](./external/video-design/remotion/SKILL.md) |
| **remotion-best-practices** | Remotion 影片創作的最佳實踐建議。 | [SKILL.md](./external/video-design/remotion-best-practices/SKILL.md) |
| **remotion-render** | 透過 inference.sh 渲染 React/Remotion 組件為影片。 | [SKILL.md](./external/video-design/remotion-render/SKILL.md) |
| **remotion-marketing-automation** | 自動化產生 Blog 與 Web App 的宣傳圖影（OG Images, Feature Previews）。 | [SKILL.md](./custom/video-design/remotion-marketing-automation/SKILL.md) |
| **ai-video-generation** | 透過 RunComfy CLI 生成與編輯 AI 影片，支援多種模型路由（HappyHorse, Wan, Kling, Seedance 等）。 | [SKILL.md](./external/video-design/ai-video-generation/SKILL.md) |
| **ckm:banner-design** | 多格式創意橫幅 (Banner) 設計系統，支援社群媒體、廣告、網頁與印刷橫幅。 | [SKILL.md](./external/video-design/ckm-banner-design/SKILL.md) |
| **brandkit** | 精英級品牌標識與視覺系統設計，適用於極簡、科技、豪華等風格的 Logo、 identity 系統及品牌指南。 | [SKILL.md](./external/video-design/brandkit/SKILL.md) |
| **imagegen-frontend-mobile** | 用於創建高品質原生行動端畫面概念的圖像生成指南，注重層次、排版與一致性。 | [SKILL.md](./external/video-design/imagegen-frontend-mobile/SKILL.md) |
| **imagegen-frontend-web** | 用於生成高品質網頁設計參考圖的圖像生成指南，支援單一色調及分段圖像生成。 | [SKILL.md](./external/video-design/imagegen-frontend-web/SKILL.md) |
| **hyperframes-animation** | 專注於設計精美的網頁 CSS/GSAP 動效與轉場動畫，適合製作引人注目的動態元件。 | [SKILL.md](./external/video-design/hyperframes-animation/SKILL.md) |
| **chart-visualization** | 基於 AntV 的數據視覺化最佳實踐，指導 AI 如何設計既好看又清晰的圖表。 | [SKILL.md](./external/video-design/chart-visualization/SKILL.md) |

## 💼 職涯與求職 (Career & Job Seeking)
| 技能名稱 | 中文說明 | 檔案連結 |
| :--- | :--- | :--- |
| **tailored-resume-generator** | 根據職位描述自動生成客製化履歷。 | [SKILL.md](./external/career/tailored-resume-generator/SKILL.md) |
| **discovery-interview** | 透過探索式訪談練習，提升挖掘需求與提問能力。 | [SKILL.md](./external/career/discovery-interview/SKILL.md) |
| **interview-prep** | 專業的面試準備工具，提供常見問題與應對策略。 | [SKILL.md](./external/career/interview-prep/SKILL.md) |

## 🧠 思維與邏輯 (Thinking & Logic)
| 技能名稱 | 中文說明 | 檔案連結 |
| :--- | :--- | :--- |
| **critical-thinking-logical-reasoning** | 深度批判性思考與邏輯推理，適用於分析複雜文章與報告。 | [SKILL.md](./external/think/critical-thinking-logical-reasoning/SKILL.md) |
| **firstprinciples** | 第一性原理分析：拆解至公理、挑戰假設、重建真相。 | [SKILL.md](./external/think/firstprinciples/SKILL.md) |
| **minerva-hcs** | 密涅瓦大學核心思維模型 (HCs)，用於跨領域的深度問題拆解與推導。 | [SKILL.md](./custom/think/minerva-hcs/SKILL.md) |
| **running-decision-processes** | 運行高品質決策流程，產出包含選項矩陣、權責劃分與決策日誌的完整決策包。 | [SKILL.md](./external/think/decision-management/SKILL.md) |
| **learning-coach** | 基於腦科學的學習教練，提供主動回想、間隔重複等高效學習法。 | [SKILL.md](./external/think/learning-coach/SKILL.md) |
| **how-to-read-a-book** | 莫提默·艾德勒《如何閱讀一本書》萃取的系統化主動閱讀框架。 | [SKILL.md](./custom/books/how-to-read-a-book/SKILL.md) |


## 🏥 健康管理 (Health Management)
| 技能名稱 | 中文說明 | 檔案連結 |
| :--- | :--- | :--- |
| **healthkit** | Apple HealthKit API 參考：查詢健康數據、鍛鍊紀錄與讀寫權限。 | [SKILL.md](./external/health/healthkit/SKILL.md) |
| **nutritional-specialist** | 專業營養專家，提供飲食建議與飲食計畫。 | [SKILL.md](./external/health/nutritional-specialist/SKILL.md) |
| **rp-diet** | 基於科學的飲食與運動管理工具。 | [SKILL.md](./external/health/rp-diet/SKILL.md) |
| **fitness-coach** | 個人健身教練，提供運動指導與計畫。 | [SKILL.md](./external/health/fitness-coach/SKILL.md) |
| **workout-program-designer** | 針對不同目標設計客製化運動訓練菜單。 | [SKILL.md](./external/health/workout-program-designer/SKILL.md) |
| **rem-sleep** | 睡眠品質優化與恢復建議。 | [SKILL.md](./external/health/rem-sleep/SKILL.md) |
| **mental-health-psychoeducation** | 心理健康教育與壓力管理建議。 | [SKILL.md](./external/health/mental-health-psychoeducation/SKILL.md) |
| **dopamine-nation** | 安娜·蘭布克《多巴胺國度》萃取的成癮科學與身心平衡框架。 | [SKILL.md](./custom/books/dopamine-nation/SKILL.md) |


## 🏠 生活與職涯 (Lifestyle & Career)
| 技能名稱 | 中文說明 | 檔案連結 |
| :--- | :--- | :--- |
| **habit-tracker** | 建立與追蹤每日健康習慣。 | [SKILL.md](./external/lifestyle/habit-tracker/SKILL.md) |
| **personal-productivity** | 提升個人工作與生活效率的高級指南。 | [SKILL.md](./external/lifestyle/personal-productivity/SKILL.md) |
| **designing-your-work-life** | 史丹佛《設計你的工作和人生》萃取的職場設計與職業轉型框架。 | [SKILL.md](./custom/books/designing-your-work-life/SKILL.md) |


---
*最後更新日期: 2026-06-30*

