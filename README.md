# registro_visitantes
Projeto Integrador II - Univesp - Turma 01 grupo 021 O presente projeto foi inicialmente desenvolvido para atender uma demanda de uma das comunidades visitadas. Neste caso um condomínio residencial. O sistema desenvolvido almeja possibilitar o registro de acesso de visitantes ao condomínio. O modelo original foi baseado no conceito entidade-relacionamento:  
<img width="886" height="591" alt="image" src="https://github.com/user-attachments/assets/81bd250e-d883-44bc-9730-2b0d62b1dc1d" />

## Diagrama Entidade-Relacionamento (DER)

```mermaid
erDiagram
    CONDOMINIOS ||--o{ MORADORES : "possui"
    MORADORES ||--o{ VISITANTES : "recebe"
    USUARIOS ||--o{ VISITANTES : "registra"

    CONDOMINIOS {
        LONG id PK
        STRING nome "NOT NULL"
    }
    
    MORADORES {
        LONG id PK
        STRING nome_morador "NOT NULL"
        INTEGER casa "NOT NULL"
        LONG condominio_id FK "NOT NULL"
    }
    
    VISITANTES {
        LONG id PK
        STRING nome "NOT NULL"
        STRING documento "NOT NULL, UNIQUE"
        STRING veiculo "NULLABLE"
        STRING motivo "NULLABLE"
        DATETIME entrada "NOT NULL"
        DATETIME saida "NULLABLE"
        DATE data_visita "NULLABLE"
        STRING razao_visita "NULLABLE"
        STRING numero_casa "NULLABLE"
        STRING nome_visitado "NULLABLE"
        STRING telefone_visitado "NULLABLE"
        STRING autorizador "NULLABLE"
        LONG morador_id FK "NULLABLE"
    }
    
    USUARIOS {
        LONG id PK
        STRING email "NOT NULL, UNIQUE"
        STRING password_hash "NOT NULL"
        BOOLEAN is_admin "NOT NULL, DEFAULT FALSE"
        DATETIME created_at "NOT NULL"
    }
```

### Relacionamentos:
- **CONDOMINIOS → MORADORES**: Um condomínio pode ter vários moradores (1:N)
- **MORADORES → VISITANTES**: Um morador pode receber vários visitantes (1:N)
- **USUARIOS → VISITANTES**: Um usuário (porteiro) pode registrar vários visitantes (1:N)

### Tabelas Principais:
- **condominios**: Armazena informações dos condomínios
- **moradores**: Armazena dados dos moradores por casa
- **visitantes**: Registra todas as visitas com entrada/saída
- **usuarios**: Sistema de autenticação para porteiros/administradores

## História do Usuário

```mermaid
flowchart LR
    %% === LAYOUT RETANGULAR ORGANIZADO ===
    
    %% COLUNA 1: ATORES
    subgraph Col1 ["� ATORES"]
        direction TB
        A1["👤<br/>VISITANTE"]
        A2["🚪<br/>PORTEIRO"] 
        A3["🏠<br/>MORADOR"]
        A4["⚙️<br/>ADMIN"]
    end
    
    %% COLUNA 2: FRONTEND
    subgraph Col2 ["📱 FRONTEND"]
        direction TB
        F1["🔐<br/>login.html"]
        F2["📝<br/>visitantes.html"]
        F3["📋<br/>listar_visitantes.html"]
        F4["👥<br/>moradores.html"]
    end
    
    %% COLUNA 3: BACKEND
    subgraph Col3 ["🔧 BACKEND"]
        direction TB
        B1["🎯<br/>VisitanteController"]
        B2["🎯<br/>MoradorController"]
        B3["🔑<br/>AuthController"]
    end
    
    %% COLUNA 4: DATABASE
    subgraph Col4 ["🗄️ DATABASE"]
        direction TB
        D1[("📊<br/>visitantes")]
        D2[("👤<br/>moradores")]
        D3[("🔐<br/>usuarios")]
        D4[("🏢<br/>condominios")]
    end
    
    %% === CONEXÕES PERPENDICULARES ===
    
    %% Fluxo 1: Login (Horizontal)
    A2 ---|1| F1
    F1 ---|2| B3  
    B3 ---|3| D3
    
    %% Fluxo 2: Registro Visitante (Horizontal)
    A1 ---|4| F2
    F2 ---|5| B1
    B1 ---|6| D1
    B1 ---|7| D2
    
    %% Fluxo 3: Consulta (Horizontal) 
    A2 ---|8| F3
    F3 ---|9| B1
    B1 ---|10| D1
    
    %% Fluxo 4: Gestão Moradores (Horizontal)
    A4 ---|11| F4
    F4 ---|12| B2
    B2 ---|13| D2
    B2 ---|14| D4
    
    %% Autorização Morador (Vertical)
    A3 ---|15| D2
    
    %% === ESTILOS LIMPOS ===
    classDef actor fill:#FFE6E6,stroke:#CC0000,stroke-width:2px,color:#000
    classDef frontend fill:#E6F3FF,stroke:#0066CC,stroke-width:2px,color:#000  
    classDef backend fill:#E6FFE6,stroke:#00AA00,stroke-width:2px,color:#000
    classDef database fill:#FFF0E6,stroke:#FF6600,stroke-width:2px,color:#000
    
    class A1,A2,A3,A4 actor
    class F1,F2,F3,F4 frontend
    class B1,B2,B3 backend
    class D1,D2,D3,D4 database
```

## Animação GIF - Simulação Real do Fluxo A4

### 🎬 Frame por Frame (1 segundo cada):

**Frame 1-6: FLUXO DE LOGIN**
```mermaid
flowchart LR
    subgraph Col1 ["👥 ATORES"]
        direction TB
        A1["👤<br/>VISITANTE"]
        A2["🚪<br/>PORTEIRO"] 
        A3["🏠<br/>MORADOR"]
        A4["⚙️<br/>ADMIN"]
    end
    
    subgraph Col2 ["📱 FRONTEND"]
        direction TB
        F1["🔐<br/>login.html"]
        F2["📝<br/>visitantes.html"]
        F3["📋<br/>listar_visitantes.html"]
        F4["👥<br/>moradores.html"]
    end
    
    subgraph Col3 ["🔧 BACKEND"]
        direction TB
        B1["🎯<br/>VisitanteController"]
        B2["🎯<br/>MoradorController"]
        B3["🔑<br/>AuthController"]
    end
    
    subgraph Col4 ["🗄️ DATABASE"]
        direction TB
        D1[("📊<br/>visitantes")]
        D2[("👤<br/>moradores")]
        D3[("�<br/>usuarios")]
        D4[("🏢<br/>condominios")]
    end
    
    %% Frame 1: Porteiro ativo
    A2 ---|"🟢 F1: Porteiro acessa"| F1
    F1 ---|2| B3  
    B3 ---|3| D3
    
    classDef activeGreen fill:#00FF00,stroke:#00AA00,stroke-width:3px,color:#000
    classDef normal fill:#FFE6E6,stroke:#CC0000,stroke-width:2px,color:#000
    classDef frontend fill:#E6F3FF,stroke:#0066CC,stroke-width:2px,color:#000  
    classDef backend fill:#E6FFE6,stroke:#00AA00,stroke-width:2px,color:#000
    classDef database fill:#FFF0E6,stroke:#FF6600,stroke-width:2px,color:#000
    
    class A2 activeGreen
    class A1,A3,A4 normal
    class F1,F2,F3,F4 frontend
    class B1,B2,B3 backend
    class D1,D2,D3,D4 database
```

**Frame 7-13: CHEGADA DO VISITANTE**
```mermaid
flowchart LR
    subgraph Col1 ["👥 ATORES"]
        direction TB
        A1["👤<br/>VISITANTE"]
        A2["🚪<br/>PORTEIRO"] 
        A3["🏠<br/>MORADOR"]
        A4["⚙️<br/>ADMIN"]
    end
    
    subgraph Col2 ["📱 FRONTEND"]
        direction TB
        F1["🔐<br/>login.html"]
        F2["📝<br/>visitantes.html"]
        F3["📋<br/>listar_visitantes.html"]
        F4["👥<br/>moradores.html"]
    end
    
    subgraph Col3 ["🔧 BACKEND"]
        direction TB
        B1["🎯<br/>VisitanteController"]
        B2["🎯<br/>MoradorController"]
        B3["🔑<br/>AuthController"]
    end
    
    subgraph Col4 ["🗄️ DATABASE"]
        direction TB
        D1[("📊<br/>visitantes")]
        D2[("👤<br/>moradores")]
        D3[("🔐<br/>usuarios")]
        D4[("🏢<br/>condominios")]
    end
    
    %% Frame 7: Visitante chega
    A1 ---|"🟢 F7: Visitante chega"| F2
    F2 ---|8| B1
    B1 ---|9| D2
    
    classDef activeGreen fill:#00FF00,stroke:#00AA00,stroke-width:3px,color:#000
    classDef normal fill:#FFE6E6,stroke:#CC0000,stroke-width:2px,color:#000
    classDef frontend fill:#E6F3FF,stroke:#0066CC,stroke-width:2px,color:#000  
    classDef backend fill:#E6FFE6,stroke:#00AA00,stroke-width:2px,color:#000
    classDef database fill:#FFF0E6,stroke:#FF6600,stroke-width:2px,color:#000
    
    class A1 activeGreen
    class A2,A3,A4 normal
    class F1,F2,F3,F4 frontend
    class B1,B2,B3 backend
    class D1,D2,D3,D4 database
```

**Frame 14-19: REGISTRO DA VISITA**
```mermaid
flowchart LR
    subgraph Col1 ["👥 ATORES"]
        direction TB
        A1["👤<br/>VISITANTE"]
        A2["🚪<br/>PORTEIRO"] 
        A3["🏠<br/>MORADOR"]
        A4["⚙️<br/>ADMIN"]
    end
    
    subgraph Col2 ["📱 FRONTEND"]
        direction TB
        F1["🔐<br/>login.html"]
        F2["📝<br/>visitantes.html"]
        F3["📋<br/>listar_visitantes.html"]
        F4["👥<br/>moradores.html"]
    end
    
    subgraph Col3 ["🔧 BACKEND"]
        direction TB
        B1["🎯<br/>VisitanteController"]
        B2["🎯<br/>MoradorController"]
        B3["🔑<br/>AuthController"]
    end
    
    subgraph Col4 ["🗄️ DATABASE"]
        direction TB
        D1[("📊<br/>visitantes")]
        D2[("👤<br/>moradores")]
        D3[("🔐<br/>usuarios")]
        D4[("🏢<br/>condominios")]
    end
    
    %% Frame 14: Registra visita
    A2 ---|"🟢 F14: Registra dados"| F2
    F2 ---|"🟢 F15: POST /visitantes"| B1
    B1 ---|"🟢 F16: INSERT"| D1
    
    classDef activeGreen fill:#00FF00,stroke:#00AA00,stroke-width:3px,color:#000
    classDef activePath stroke:#00FF00,stroke-width:4px
    classDef normal fill:#FFE6E6,stroke:#CC0000,stroke-width:2px,color:#000
    classDef frontend fill:#E6F3FF,stroke:#0066CC,stroke-width:2px,color:#000  
    classDef backend fill:#E6FFE6,stroke:#00AA00,stroke-width:2px,color:#000
    classDef database fill:#FFF0E6,stroke:#FF6600,stroke-width:2px,color:#000
    
    class F2,B1,D1 activeGreen
    class A1,A2,A3,A4 normal
    class F1,F3,F4 frontend
    class B2,B3 backend
    class D2,D3,D4 database
    
    linkStyle 0 stroke:#00FF00,stroke-width:4px
    linkStyle 1 stroke:#00FF00,stroke-width:4px
    linkStyle 2 stroke:#00FF00,stroke-width:4px
```

**Frame 20-25: CONSULTA DE VISITANTES**
```mermaid
flowchart LR
    subgraph Col1 ["👥 ATORES"]
        direction TB
        A1["👤<br/>VISITANTE"]
        A2["🚪<br/>PORTEIRO"] 
        A3["🏠<br/>MORADOR"]
        A4["⚙️<br/>ADMIN"]
    end
    
    subgraph Col2 ["📱 FRONTEND"]
        direction TB
        F1["🔐<br/>login.html"]
        F2["📝<br/>visitantes.html"]
        F3["📋<br/>listar_visitantes.html"]
        F4["👥<br/>moradores.html"]
    end
    
    subgraph Col3 ["🔧 BACKEND"]
        direction TB
        B1["🎯<br/>VisitanteController"]
        B2["🎯<br/>MoradorController"]
        B3["🔑<br/>AuthController"]
    end
    
    subgraph Col4 ["🗄️ DATABASE"]
        direction TB
        D1[("📊<br/>visitantes")]
        D2[("👤<br/>moradores")]
        D3[("🔐<br/>usuarios")]
        D4[("🏢<br/>condominios")]
    end
    
    %% Frame 20: Consulta lista
    A2 ---|"🟢 F20: Consulta lista"| F3
    F3 ---|"🟢 F21: GET /visitantes"| B1
    B1 ---|"🟢 F22: SELECT"| D1
    
    classDef activeGreen fill:#00FF00,stroke:#00AA00,stroke-width:3px,color:#000
    classDef normal fill:#FFE6E6,stroke:#CC0000,stroke-width:2px,color:#000
    classDef frontend fill:#E6F3FF,stroke:#0066CC,stroke-width:2px,color:#000  
    classDef backend fill:#E6FFE6,stroke:#00AA00,stroke-width:2px,color:#000
    classDef database fill:#FFF0E6,stroke:#FF6600,stroke-width:2px,color:#000
    
    class A2,F3,B1,D1 activeGreen
    class A1,A3,A4 normal
    class F1,F2,F4 frontend
    class B2,B3 backend
    class D2,D3,D4 database
    
    linkStyle 0 stroke:#00FF00,stroke-width:4px
    linkStyle 1 stroke:#00FF00,stroke-width:4px
    linkStyle 2 stroke:#00FF00,stroke-width:4px
```

### 🎯 **Sequência de Animação (25 frames total):**

1. **Frames 1-6**: Login do Sistema (verde percorre A2→F1→B3→D3)
2. **Frames 7-13**: Chegada do Visitante (verde percorre A1→A2→F2→B1→D2)
3. **Frames 14-19**: Registro da Visita (verde percorre A2→F2→B1→D1)
4. **Frames 20-25**: Consulta de Visitantes (verde percorre A2→F3→B1→D1)

### 📋 **Para criar o GIF:**
- Cada frame = 1 segundo
- Elemento ativo = cor verde (#00FF00)
- Conexões ativas = linha verde espessa
- Elementos inativos = cores normais
- Total: 25 segundos de animação

### User Stories Detalhadas:

#### 🚪 **Como Porteiro**
- **US001**: Como porteiro, quero fazer login no sistema para acessar as funcionalidades de registro
- **US002**: Como porteiro, quero registrar a entrada de visitantes para controlar o acesso ao condomínio
- **US003**: Como porteiro, quero registrar a saída de visitantes para manter o controle completo
- **US004**: Como porteiro, quero consultar a lista de visitantes para verificar quem está no condomínio
- **US005**: Como porteiro, quero buscar visitantes por nome/documento para localizar registros rapidamente

#### 🏠 **Como Morador**
- **US006**: Como morador, quero que meus visitantes sejam registrados adequadamente para garantir segurança
- **US007**: Como morador, quero que o sistema mantenha meus dados atualizados para facilitar o registro

#### 👤 **Como Administrador**
- **US008**: Como administrador, quero gerenciar usuários do sistema para controlar acessos
- **US009**: Como administrador, quero visualizar relatórios de visitação para análise de segurança
- **US010**: Como administrador, quero gerenciar dados dos moradores para manter informações atualizadas

### Fluxos Principais:

#### 📝 **Fluxo de Registro de Entrada**
1. Visitante chega à portaria
2. Porteiro solicita documento de identificação
3. Porteiro acessa formulário de registro (`visitantes.html`)
4. Sistema valida dados via `VisitanteController.java`
5. Dados são salvos no banco PostgreSQL
6. Visitante recebe autorização de entrada

#### 📋 **Fluxo de Consulta**
1. Porteiro acessa lista de visitantes (`listar_visitantes.html`)
2. Sistema carrega dados via `script_lista_visitantes.js`
3. API retorna registros do banco de dados
4. Interface exibe lista formatada

#### 🚶 **Fluxo de Registro de Saída**
1. Visitante solicita saída
2. Porteiro localiza registro ativo
3. Sistema atualiza horário de saída
4. Registro é finalizado no banco

Para a base de desenvolvimento foi utilizado o docker desktop, com Postgres, focando no desenvolvimento triplo (DB, Frontend, Backend).

