CREATE TABLE utilisateur (
  id_utilisateur     number(10) NOT NULL, 
  matricule          number(10) NOT NULL, 
  nom_utilisateur    varchar2(255) NOT NULL, 
  prenom_utilisateur varchar2(255) NOT NULL, 
  mot_de_pass        varchar2(255) NOT NULL, 
  login              varchar2(255) NOT NULL, 
  mail               varchar2(255) NOT NULL, 
  id_role            number(10) NOT NULL, 
  id_service         number(10) NOT NULL, 
  PRIMARY KEY (id_utilisateur));
CREATE TABLE log_action (
  id_log         number(10) NOT NULL, 
  action         varchar2(255) NOT NULL, 
  ip_adresse     varchar2(255) NOT NULL, 
  navigateur     varchar2(255) NOT NULL, 
  date_action    date NOT NULL, 
  id_utilisateur number(10) NOT NULL, 
  PRIMARY KEY (id_log));
CREATE TABLE role (
  id_role          number(10) NOT NULL, 
  role_nom         varchar2(255) NOT NULL, 
  description_role varchar2(255), 
  PRIMARY KEY (id_role));
CREATE TABLE direction (
  id_direction  number(10) NOT NULL, 
  direction_nom varchar2(255) NOT NULL, 
  PRIMARY KEY (id_direction));
CREATE TABLE service (
  id_service   number(10) NOT NULL, 
  service_nom  varchar2(255) NOT NULL, 
  id_direction number(10) NOT NULL, 
  PRIMARY KEY (id_service));
CREATE TABLE validation (
  id_validation   number(10) NOT NULL, 
  decision        varchar2(255) NOT NULL, 
  date_validation date, 
  "Column"        number(10), 
  id_extraction   number(10) NOT NULL, 
  id_utilisateur  number(10) NOT NULL, 
  PRIMARY KEY (id_validation));
CREATE TABLE valeur_extrait (
  id_extraction       number(10) NOT NULL, 
  date_extraction     date NOT NULL, 
  serdau              varchar2(255) NOT NULL, 
  datedau             date NOT NULL, 
  liquide             varchar2(255) NOT NULL, 
  dateliquide         date NOT NULL, 
  importateur         varchar2(255) NOT NULL, 
  exportateur         varchar2(255) NOT NULL, 
  pays_destinataire   varchar2(255) NOT NULL, 
  description_article varchar2(255) NOT NULL, 
  poid_brut           number(19) NOT NULL, 
  poid_net            number(19) NOT NULL, 
  quantite            number(19) NOT NULL, 
  unite               varchar2(255) NOT NULL, 
  prix_article        number(19) NOT NULL, 
  incoterm            varchar2(255) NOT NULL, 
  id_utilisateur      number(10) NOT NULL, 
  PRIMARY KEY (id_extraction));
CREATE TABLE historique_valeur (
  id_historique   number(10) NOT NULL, 
  champ_modifies  varchar2(255) NOT NULL, 
  ancienne_valeur varchar2(255) NOT NULL, 
  nouvelle_valeur varchar2(255) NOT NULL, 
  date_modif      date NOT NULL, 
  id_valeur       number(10) NOT NULL, 
  id_utilisateur  number(10) NOT NULL, 
  PRIMARY KEY (id_historique));
CREATE TABLE valeur (
  id_valeur            number(10) NOT NULL, 
  codesh               varchar2(255) NOT NULL, 
  descrip              varchar2(255) NOT NULL, 
  unite                varchar2(255) NOT NULL, 
  quantite             number(19) NOT NULL, 
  pu_fact              number(19) NOT NULL, 
  pu_redr              number(19) NOT NULL, 
  methode              varchar2(255) NOT NULL, 
  incoterm             varchar2(255) NOT NULL, 
  devise               varchar2(255) NOT NULL, 
  source               varchar2(255) NOT NULL, 
  ref_fact             varchar2(255) NOT NULL, 
  status               varchar2(255) NOT NULL, 
  details_marchandises varchar2(255) NOT NULL, 
  poid_brut            number(19) NOT NULL, 
  poid_net             number(19) NOT NULL, 
  exportateur          varchar2(255) NOT NULL, 
  pays_destinataire    varchar2(255) NOT NULL, 
  importateur          varchar2(255) NOT NULL, 
  conditionnement      varchar2(255) NOT NULL, 
  image                blob NOT NULL, 
  date_effet           date NOT NULL, 
  id_extraction        number(10), 
  id_utilisateur       number(10) NOT NULL, 
  PRIMARY KEY (id_valeur));
ALTER TABLE log_action ADD CONSTRAINT concerner FOREIGN KEY (id_utilisateur) REFERENCES utilisateur (id_utilisateur);
ALTER TABLE utilisateur ADD CONSTRAINT posede FOREIGN KEY (id_role) REFERENCES role (id_role);
ALTER TABLE service ADD CONSTRAINT inclus FOREIGN KEY (id_direction) REFERENCES direction (id_direction);
ALTER TABLE utilisateur ADD CONSTRAINT appartient FOREIGN KEY (id_service) REFERENCES service (id_service);
ALTER TABLE valeur ADD CONSTRAINT manipuler FOREIGN KEY (id_utilisateur) REFERENCES utilisateur (id_utilisateur);
ALTER TABLE historique_valeur ADD CONSTRAINT impliquer FOREIGN KEY (id_utilisateur) REFERENCES utilisateur (id_utilisateur);
ALTER TABLE valeur_extrait ADD CONSTRAINT extraire FOREIGN KEY (id_utilisateur) REFERENCES utilisateur (id_utilisateur);
ALTER TABLE validation ADD CONSTRAINT effectuer FOREIGN KEY (id_utilisateur) REFERENCES utilisateur (id_utilisateur);
ALTER TABLE historique_valeur ADD CONSTRAINT contient FOREIGN KEY (id_valeur) REFERENCES valeur (id_valeur);
ALTER TABLE validation ADD CONSTRAINT valide FOREIGN KEY (id_extraction) REFERENCES valeur_extrait (id_extraction);
ALTER TABLE valeur ADD CONSTRAINT cree FOREIGN KEY (id_extraction) REFERENCES valeur_extrait (id_extraction);
