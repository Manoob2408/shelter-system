# 🐾 PataFeliz — Sistema de Gestão de Abrigo de Animais

Sistema web completo para gerenciamento de abrigo de animais com:
- **Backend:** Java 17 + Spring Boot 3 + JPA/Hibernate + H2 (banco em memória)
- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS

---

## 📁 Estrutura do Projeto

```
shelter-system/
├── backend/                  # Spring Boot API
│   ├── src/main/java/com/shelter/
│   │   ├── controller/       # REST endpoints
│   │   ├── service/          # Regras de negócio
│   │   ├── repository/       # Acesso ao banco
│   │   ├── model/            # Entidades JPA
│   │   ├── dto/              # DTOs de entrada e saída
│   │   └── config/           # CORS, seeder de dados
│   └── pom.xml
│
└── frontend/                 # React + Vite
    ├── src/
    │   ├── components/       # Componentes reutilizáveis
    │   ├── pages/            # Dashboard, Lista, Formulário, Detalhe
    │   ├── services/         # Chamadas à API
    │   ├── types/            # Tipos TypeScript
    │   └── utils/            # Labels, cores, formatação
    └── package.json
```

---

## 🚀 Como rodar

### Pré-requisitos
- Java 17+
- Maven 3.6+
- Node.js 18+

### Backend

```bash
cd backend
./mvnw spring-boot:run
# ou: mvn spring-boot:run
```

A API estará disponível em: **http://localhost:8080**

Console H2 (banco em memória): http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:shelterdb`
- User: `sa` / sem senha

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em: **http://localhost:5173**

> O Vite já está configurado para fazer proxy de `/api` → `http://localhost:8080`, então não precisa de configuração de CORS extra.

---

## 📡 Endpoints da API

| Método | URL | Descrição |
|--------|-----|-----------|
| GET | `/api/animals` | Listar animais (com filtros) |
| GET | `/api/animals/{id}` | Buscar animal por ID |
| POST | `/api/animals` | Cadastrar animal |
| PUT | `/api/animals/{id}` | Atualizar animal |
| DELETE | `/api/animals/{id}` | Remover animal |
| GET | `/api/animals/stats` | Estatísticas gerais |

### Filtros disponíveis em GET /api/animals:
- `?name=Rex`
- `?species=DOG` (DOG, CAT, RABBIT, BIRD, REPTILE, OTHER)
- `?status=AVAILABLE` (AVAILABLE, ADOPTED, UNDER_TREATMENT, RESERVED, DECEASED)
- `?breed=Labrador`

### Exemplo de payload para cadastrar animal:
```json
{
  "name": "Rex",
  "species": "DOG",
  "breed": "Labrador Retriever",
  "ageYears": 3,
  "ageMonths": 0,
  "gender": "MALE",
  "size": "LARGE",
  "status": "AVAILABLE",
  "color": "Amarelo",
  "weight": 28.5,
  "castrated": true,
  "microchipped": true,
  "microchipNumber": "985141001234567",
  "temperament": "Dócil e brincalhão",
  "description": "Encontrado abandonado no parque",
  "entryDate": "2024-01-15",
  "vaccines": [
    {
      "name": "V10 (Décupla)",
      "applicationDate": "2024-01-20",
      "nextDoseDate": "2025-01-20",
      "veterinarian": "Dra. Ana Souza",
      "manufacturer": "Zoetis"
    }
  ],
  "diseases": []
}
```

---

## 🖥️ Funcionalidades do Sistema

- **Dashboard** com estatísticas e animais recentes
- **Listagem** com filtros por nome, raça, espécie e status
- **Cadastro completo** com:
  - Dados básicos (espécie, raça, nome, idade, sexo, porte, cor, peso)
  - Datas de entrada e adoção
  - Castração e microchipagem
  - Descrição, temperamento, necessidades especiais
  - Vacinas (nome, fabricante, lote, datas, veterinário)
  - Doenças/condições (nome, status, diagnóstico, tratamento)
- **Detalhe** do animal com todas as informações
- **Edição** e **exclusão** de animais
- **Relatórios** com gráficos de status e espécies

---

## 🔧 Para usar banco de dados real (PostgreSQL)

Substitua no `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/shelterdb
spring.datasource.username=postgres
spring.datasource.password=sua_senha
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
```

E adicione no `pom.xml`:
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```
