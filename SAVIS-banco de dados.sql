CREATE TABLE enderecos (
    cod INT NOT NULL AUTO_INCREMENT,
    rua VARCHAR(50) NOT NULL,
    numero INT NOT NULL,
    bairro VARCHAR(20) NOT NULL,
    cidade VARCHAR(30) NOT NULL,
    UF CHAR(2) NOT NULL,
    CEP CHAR(9) NOT NULL,
    CONSTRAINT pk_enderecos PRIMARY KEY (cod), 
    CONSTRAINT ck_enderecos_UF CHECK (UF IN ('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'))
);

CREATE TABLE generos (
    cod INT NOT NULL AUTO_INCREMENT,
    descricao CHAR(13) NOT NULL, 
    CONSTRAINT pk_generos PRIMARY KEY (cod),
    CONSTRAINT ck_generos_descricao CHECK (descricao IN ('Masculino', 'Feminino', 'Não-binário', 'Outro'))
);

CREATE TABLE status (
    cod INT NOT NULL AUTO_INCREMENT,
    descricao VARCHAR(9) NOT NULL,
    CONSTRAINT pk_status PRIMARY KEY (cod),
    CONSTRAINT ck_status CHECK (descricao IN ('Cancelada', 'Concluída', 'Pendente'))
);

CREATE TABLE usuarios (
    cod INT NOT NULL AUTO_INCREMENT,
    img BLOB,
    nome VARCHAR(40) NOT NULL,
    data_nasc DATE NOT NULL,
    CPF CHAR(14) UNIQUE NOT NULL,
    genero INT NOT NULL,
    email VARCHAR(30) NOT NULL,
    fone CHAR(16) NOT NULL,
    endereco INT NOT NULL,
    SUS CHAR(15) NOT NULL,
    senha VARCHAR(16) NOT NULL,
    CONSTRAINT pk_usuarios PRIMARY KEY (cod), 
    CONSTRAINT fk_usuarios_endereco FOREIGN KEY (endereco) REFERENCES enderecos(cod)
        ON DELETE CASCADE ON UPDATE CASCADE, 
    CONSTRAINT fk_usuarios_genero FOREIGN KEY (genero) REFERENCES generos(cod)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE solicitacoes (
    cod INT NOT NULL AUTO_INCREMENT,
    usuario INT NOT NULL, 
    local_consul VARCHAR(50) NOT NULL,
    data_consul DATE NOT NULL,
    hora_consul TIME NOT NULL,
    encaminhamento BLOB NOT NULL,
    status INT, 
    objetivo VARCHAR(30) NOT NULL,
    obs VARCHAR(255), 
    data_solicita DATE,
    hora_solicita TIME,
    CONSTRAINT pk_solicitacoes PRIMARY KEY (cod), 
    CONSTRAINT fk_solicitacoes_usuario FOREIGN KEY (usuario) REFERENCES usuarios(cod)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_solicitacoes_status FOREIGN KEY (status) REFERENCES status(cod)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE documentos (
    cod INT NOT NULL AUTO_INCREMENT,
    carteira_trab BLOB,
    cursos BLOB,
    habilitacao BLOB,
    comprov_resid BLOB,
    comprov_escola BLOB,
    titulo_eleitor BLOB,
    ant_crim BLOB,
    exame_tox BLOB,
    CONSTRAINT pk_documentos PRIMARY KEY (cod)
);

CREATE TABLE motoristas (
    cod INT NOT NULL AUTO_INCREMENT,
    matricula INT UNIQUE,
    img BLOB,
    nome VARCHAR(40),
    data_nasc DATE,
    CPF CHAR(14) UNIQUE,
    fone CHAR(16),
    email VARCHAR(30),
    endereco INT, 
    genero INT, 
    docs INT,
    senha VARCHAR(16) NOT NULL, 
    CONSTRAINT pk_motoristas PRIMARY KEY (cod), 
    CONSTRAINT fk_motoristas_endereco FOREIGN KEY (endereco) REFERENCES enderecos(cod)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_motoristas_genero FOREIGN KEY (genero) REFERENCES generos(cod)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_motoristas_docs FOREIGN KEY (docs) REFERENCES documentos(cod)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE viagens (
    cod INT NOT NULL AUTO_INCREMENT,
    destino_cid VARCHAR(30),
    data_viagem DATE,
    horario_saida TIME,
    lugares_dispo INT,
    modelo_car VARCHAR(30),
    placa CHAR(7),
    motorista INT, 
    status INT, 
    combustivel REAL,
    km_inicial REAL,
    km_final REAL,
    paradas VARCHAR(200),
    horario_chega TIME,
    obs VARCHAR(255),
    CONSTRAINT pk_viagens PRIMARY KEY (cod), 
    CONSTRAINT fk_viagens_motorista FOREIGN KEY (motorista) REFERENCES motoristas(cod)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_viagens_status FOREIGN KEY (status) REFERENCES status(cod)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE chefes (
    cod INT NOT NULL AUTO_INCREMENT,
    matricula INT NOT NULL UNIQUE,
    senha VARCHAR(16) NOT NULL,
    nome VARCHAR(40) NOT NULL,
    CONSTRAINT pk_chefes PRIMARY KEY (cod)
);

INSERT INTO chefes (matricula, senha, nome)
VALUES (1234, '1234', 'Ber');