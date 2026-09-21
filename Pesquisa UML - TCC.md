
## 1. O que é UML?

### Conceito

A UML (*Unified Modeling Language* - Linguagem de Modelagem Unificada) é uma linguagem-padrão para a elaboração de diagramas de sistemas de software. Ela fornece uma forma visual de representar a arquitetura, o comportamento e a estrutura de um sistema, facilitando a comunicação entre os membros da equipe de desenvolvimento, stakeholders e clientes .

A UML não é uma metodologia, mas sim uma notação gráfica que permite documentar, visualizar, especificar, construir e documentar os artefatos de um sistema orientado a objetos.

### Objetivo

Os principais objetivos da UML são:

- **Visualizar** o sistema de diferentes perspectivas, tornando conceitos abstratos mais tangíveis.
- **Especificar** os requisitos e o comportamento do sistema de forma precisa.
- **Documentar** as decisões de projeto, arquitetura e código, servindo como um guia para todo o ciclo de desenvolvimento.
- **Comunicar** ideias e intenções de projeto de maneira clara e padronizada entre todos os envolvidos no projeto.

### História

A UML foi criada na década de 1990 através da unificação de três metodologias de modelagem orientada a objetos amplamente utilizadas: o método Booch (de Grady Booch), a OMT (*Object Modeling Technique*, de James Rumbaugh) e o OOSE (*Object-Oriented Software Engineering*, de Ivar Jacobson). Esses três engenheiros de software, conhecidos como "Os Três Amigos", uniram esforços na Rational Software Corporation para criar uma linguagem de modelagem unificada.

Em 1997, a UML 1.0 foi submetida e aprovada pelo OMG (*Object Management Group*), tornando-se um padrão internacional. A UML passou por diversas evoluções, sendo a versão 2.5.1 a mais recente e consolidada, que trouxe melhorias significativas na clareza e precisão dos diagramas.

### Onde é utilizada

A UML é amplamente utilizada na indústria de desenvolvimento de software em diversos contextos:

- **Levantamento de Requisitos**: Para entender e documentar as necessidades dos usuários (ex: com Diagramas de Caso de Uso).
- **Projeto e Arquitetura**: Para definir a estrutura estática (ex: Diagrama de Classes) e o comportamento dinâmico do sistema (ex: Diagrama de Sequência).
- **Desenvolvimento**: Como um blue-print para a codificação.
- **Documentação**: Para criar documentação técnica que pode ser facilmente compreendida por novos membros da equipe.
- **Reengenharia**: Para entender e documentar sistemas legados.

É uma ferramenta essencial em metodologias ágeis e tradicionais, aplicável a sistemas de diversos portes e complexidades.

---

## 2. O que é um Diagrama de Caso de Uso?

### Finalidade

O Diagrama de Caso de Uso é um tipo de diagrama comportamental que tem como principal finalidade **levantar e documentar os requisitos funcionais** de um sistema . Ele serve para:

- Mostrar, de forma visual e de alto nível, **o que o sistema deve fazer**, mas não **como** ele fará .
- Estabelecer uma comunicação clara e objetiva entre os desenvolvedores, o cliente e os usuários finais .
- Definir o escopo do sistema e suas interações com o mundo externo .

### Principais Elementos

Os elementos centrais de um Diagrama de Caso de Uso são:

1.  **Ator**:
    - Representa um **papel** (role) que um usuário, outro sistema ou um dispositivo de hardware desempenha ao interagir com o sistema em desenvolvimento .
    - Um ator é sempre externo ao sistema.
    - Uma mesma pessoa pode desempenhar diferentes papéis, sendo representada por vários atores .
    - Graficamente, é representado por uma figura de boneco palito ("stickman") .

2.  **Caso de Uso** (*Use Case*):
    - Especifica um conjunto de ações, interações ou uma funcionalidade que o sistema executa e que resulta em um valor mensurável para um ator .
    - Descreve um objetivo que o ator deseja alcançar ao usar o sistema.
    - Graficamente, é representado por uma elipse com seu nome (geralmente um verbo no infinitivo seguido de um substantivo) .

3.  **Relacionamento**:
    - **Associação/Comunicação**: É uma linha sólida que liga um ator a um caso de uso, indicando que o ator participa daquele caso de uso .
    - **Include (Inclusão)**: Indica que um caso de uso (base) **obrigatoriamente** inclui o comportamento de outro caso de uso (incluído) sempre que é executado . Utilizado para extrair comportamentos comuns a vários casos de uso. Representado por uma seta tracejada com o estereótipo `<<include>>` apontando para o caso de uso incluído.
    - **Extend (Extensão)**: Indica que um caso de uso (extensor) **opcionalmente** estende o comportamento de outro caso de uso (estendido) em pontos específicos (pontos de extensão), sob certas condições . Utilizado para modelar funcionalidades opcionais ou exceções. Representado por uma seta tracejada com o estereótipo `<<extend>>` apontando para o caso de uso estendido.
    - **Generalização**: Similar ao conceito de herança, indica que um caso de uso "filho" é uma especialização de um caso de uso "pai", herdando seu comportamento e significado .

### Exemplo Ilustrativo

Vamos considerar um sistema simples para uma **Biblioteca**.

- **Atores**:
    - **Bibliotecário**: Responsável por gerenciar o acervo e os usuários.
    - **Usuário**: Membro da biblioteca que deseja emprestar e devolver livros.

- **Casos de Uso**:
    - **Pesquisar Livro** (Usuário e Bibliotecário)
    - **Realizar Empréstimo** (Bibliotecário)
    - **Realizar Devolução** (Bibliotecário)
    - **Cadastrar Usuário** (Bibliotecário)
    - **Gerenciar Acervo** (Bibliotecário)

- **Relacionamentos**:
    - O caso de uso **Realizar Empréstimo** poderia `<<include>>` o caso de uso **Verificar Disponibilidade**, pois essa verificação é obrigatória para qualquer empréstimo.
    - O caso de uso **Realizar Empréstimo** poderia ser `<<extend>>` por **Realizar Empréstimo com Multa**, caso o usuário tenha pendências.

---

## 3. O que é um Diagrama de Classes?

### Finalidade

O Diagrama de Classes é um dos diagramas mais importantes da UML e é do tipo **estrutural**. Sua finalidade principal é **descrever a estrutura estática do sistema** . Ele mostra as classes que compõem o sistema, seus atributos, métodos e os relacionamentos entre elas.

Ele serve para:

- **Modelar a estrutura de dados** e a arquitetura interna do sistema.
- Servir como base para a implementação do código-fonte.
- Mostrar as relações de associação, herança, dependência, agregação e composição entre as classes.

### Elementos

1.  **Classes**: Representam um conceito ou entidade do mundo real que é relevante para o sistema. Uma classe define um conjunto de objetos que compartilham as mesmas características (atributos) e comportamentos (métodos). Graficamente, é representada por um retângulo dividido em três partes: nome, atributos e métodos.

2.  **Atributos**: São as características ou propriedades de uma classe. Representam o estado de um objeto. Exemplos: `nome: String`, `dataNascimento: Date`, `cpf: String`.

3.  **Métodos**: São as funções ou operações que uma classe pode realizar. Representam o comportamento dos objetos. Exemplos: `calcularIdade(): int`, `emprestarLivro(livro: Livro): boolean`, `validarCpf(): void`.

### Exemplo Ilustrativo de um Diagrama de Classes

Para o sistema de **Biblioteca**, poderíamos ter as seguintes classes:

```
+----------------------------------+
|            Usuario                |
+----------------------------------+
| - id: int                         |
| - nome: String                    |
| - email: String                   |
| - telefone: String                |
+----------------------------------+
| + realizarEmprestimo(livro: Livro)|
| + realizarDevolucao(livro: Livro) |
+----------------------------------+
        | 1
        |
        | *
+----------------------------------+
|             Livro                 |
+----------------------------------+
| - id: int                         |
| - titulo: String                  |
| - autor: String                   |
| - isbn: String                    |
| - disponivel: boolean             |
+----------------------------------+
| + verificarDisponibilidade(): bool|
+----------------------------------+
        | 1
        |
        | *
+----------------------------------+
|           Emprestimo              |
+----------------------------------+
| - id: int                         |
| - dataEmprestimo: Date            |
| - dataDevolucaoPrevista: Date     |
| - dataDevolucaoReal: Date         |
+----------------------------------+
| + calcularMulta(): double         |
+----------------------------------+
```

---

## 4. Comparação entre os Diagramas

Embora sejam usados em conjunto, o Diagrama de Caso de Uso e o Diagrama de Classes possuem finalidades e níveis de abstração completamente diferentes.

| Característica | Diagrama de Caso de Uso | Diagrama de Classes |
| :--- | :--- | :--- |
| **Tipo** | Comportamental | Estrutural |
| **Objetivo** | Descrever **o que** o sistema deve fazer (requisitos funcionais). | Descrever **como** o sistema será construído (sua estrutura). |
| **Nível de Abstração** | Alto nível. Foco na visão externa do sistema. | Baixo nível (mais detalhado). Foco na visão interna do sistema. |
| **Elementos Principais** | Atores, Casos de Uso, Relacionamentos (`include`, `extend`). | Classes, Atributos, Métodos, Relacionamentos (Associação, Herança, Agregação, Composição). |
| **Foco** | Interação entre o sistema e seus usuários externos. | Estrutura de dados e relacionamentos internos. |
| **Momento de Uso** | **Fase de Levantamento de Requisitos e Análise.** Utilizado para entender e comunicar as necessidades do negócio. | **Fase de Projeto e Implementação.** Utilizado para definir a arquitetura e servir de base para a codificação. |

Em resumo, o Diagrama de Caso de Uso direciona o desenvolvimento ao definir os requisitos, enquanto o Diagrama de Classes traduz esses requisitos em uma estrutura concreta para ser implementada.

---

## 5. Aplicação Prática

**Sistema Escolhido: Clínica Médica**

### Usuários (Atores)

- **Paciente**: Pessoa que agendará e receberá atendimento médico.
- **Médico**: Profissional que realizará as consultas e acessará seus pacientes.
- **Recepcionista**: Funcionário responsável pelo agendamento de consultas, cadastro de pacientes e atendimento inicial.
- **Administrador**: Responsável pela gestão dos médicos, usuários e configurações do sistema.

### Funcionalidades do Sistema

- Gerenciar Cadastro de Pacientes (Cadastrar, Consultar, Atualizar, Excluir).
- Gerenciar Agenda de Médicos (Visualizar, Agendar, Cancelar consultas).
- Realizar Atendimento (Registrar anamnese, prescrições, evolução).
- Gerenciar Cadastro de Médicos e Especialidades.
- Gerar Relatórios (Agenda, Atendimentos por período, etc.).
- Realizar Login no Sistema (Autenticação).

### Possíveis Classes

- **Paciente**: `idPaciente`, `nome`, `dataNascimento`, `cpf`, `telefone`, `email`, `endereco`.
- **Medico**: `idMedico`, `nome`, `especialidade`, `crm`, `email`, `telefone`.
- **Consulta**: `idConsulta`, `dataHora`, `status` (Agendada, Realizada, Cancelada), `paciente` (referência), `medico` (referência).
- **Atendimento**: `idAtendimento`, `data`, `diagnostico`, `prescricao`, `observacoes`, `consulta` (referência).
- **Usuario**: `idUsuario`, `login`, `senha`, `perfil` (Administrador, Recepcionista, Médico), `pessoa` (referência para Médico ou Paciente).
- **Agenda**: `idAgenda`, `medico` (referência), `data`, `horarioInicio`, `horarioFim`, `disponivel`.

---

## 6. Conclusão

A UML é uma linguagem de modelagem essencial para o desenvolvimento de software moderno, fornecendo uma base comum para a comunicação entre todos os envolvidos no projeto. A pesquisa permitiu compreender que a UML vai além de simples diagramas, sendo uma ferramenta poderosa para visualizar, especificar, construir e documentar sistemas complexos.

Diagramas como o de **Caso de Uso** e o de **Classes** são pilares nesse processo. Enquanto o Diagrama de Caso de Uso atua como uma ponte entre o mundo do negócio e o desenvolvimento, descrevendo os requisitos de forma acessível para o cliente e garantindo que todos entendam o escopo do sistema, o Diagrama de Classes mergulha na estrutura interna, fornecendo um modelo detalhado para os programadores construírem o software de forma organizada e eficiente.

---

## Referências

GUIDE TO UML DIAGRAMS. **Use Case Diagram**. *Visual Paradigm Blog*, 8 jan. 2026. Disponível em: https://blog.visual-paradigm.com/pt/use-case-diagram-tutorial/. Acesso em: 3 jul. 2026.

GUIDE TO UML DIAGRAMS. **Use Case Diagram: A Notation Guide**. *Visual Paradigm Blog*, 9 fev. 2022. Disponível em: https://blog.visual-paradigm.com/pt/use-case-diagram-a-notation-guide/. Acesso em: 3 jul. 2026.

KDE COMMUNITY. **Elementos UML**. In: *Umbrello UML Modeller Handbook*. Disponível em: https://docs.kde.org/stable_kf6/pt_BR/umbrello/umbrello/uml-elements.html. Acesso em: 3 jul. 2026.

**NATIONAL INSTITUTES OF HEALTH (NIH)**. Use-case diagram for point-of-care testing (POCT) swabbing process. *PubMed Central*, 2025. Disponível em: https://pmc.ncbi.nlm.nih.gov/articles/PMC11687256/figure/fig1/. Acesso em: 3 jul. 2026.

PLANTUML. **Diagrama de Casos de Uso**. Disponível em: http://alphadoc.plantuml.com/raw/markdown/es/use-case-diagram. Acesso em: 3 jul. 2026.

WIKIPÉDIA. **Diagrama de caso de uso**. Disponível em: https://pt.wikipedia.org/wiki/Diagrama_de_caso_de_uso. Acesso em: 3 jul. 2026.
