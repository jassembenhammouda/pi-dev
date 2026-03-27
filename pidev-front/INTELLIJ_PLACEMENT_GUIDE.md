# 📁 Guide de Placement des Fichiers - IntelliJ IDEA

## 🗂️ Structure Complète du Projet Spring Boot

```
mon-projet-pidev/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/pidev/
│   │   │       ├── PidevApplication.java          ← Classe main
│   │   │       │
│   │   │       ├── models/
│   │   │       │   ├── Event.java                 ← Existe
│   │   │       │   ├── Reservation.java           ← Existe
│   │   │       │   └── Notification.java          ← À CRÉER ⭐
│   │   │       │
│   │   │       ├── repositories/
│   │   │       │   ├── EventRepository.java       ← Existe
│   │   │       │   ├── ReservationRepository.java ← Existe
│   │   │       │   └── NotificationRepository.java ← À CRÉER ⭐
│   │   │       │
│   │   │       ├── services/
│   │   │       │   ├── EventService.java          ← Existe
│   │   │       │   ├── ReservationService.java    ← Existe
│   │   │       │   └── NotificationService.java   ← À CRÉER ⭐
│   │   │       │
│   │   │       ├── controllers/
│   │   │       │   ├── EventController.java       ← Existe
│   │   │       │   ├── ReservationController.java ← Existe
│   │   │       │   └── NotificationController.java ← À CRÉER ⭐
│   │   │       │
│   │   │       ├── dtos/
│   │   │       │   ├── EventDTO.java              ← Existe
│   │   │       │   └── NotificationDTO.java       ← À CRÉER ⭐
│   │   │       │
│   │   │       ├── config/
│   │   │       │   ├── SecurityConfig.java        ← Peut exister
│   │   │       │   └── CorsConfig.java            ← À CRÉER ⭐
│   │   │       │
│   │   │       └── scheduler/
│   │   │           └── NotificationScheduler.java ← À CRÉER ⭐
│   │   │
│   │   └── resources/
│   │       ├── application.properties             ← À MODIFIER ⭐
│   │       ├── application.yml                    ← Optionnel
│   │       └── db/
│   │           └── migration/
│   │               └── V1__create_notifications.sql ← À CRÉER ⭐
│   │
│   └── test/
│       └── java/com/pidev/
│           └── PidevApplicationTests.java
│
├── pom.xml                                         ← À MODIFIER ⭐
├── .gitignore
└── README.md
```

---

## 📍 Étapes Précises pour IntelliJ

### **Étape 1: Créer les Packages (Dossiers)**

1. **Clic droit** sur `src/main/java/com/pidev/`
2. **New** → **Package**
3. Créer les packages suivants s'ils n'existent pas:
   - ✅ `models`
   - ✅ `repositories`
   - ✅ `services`
   - ✅ `controllers`
   - ✅ `dtos`
   - ✅ `config`
   - ✅ `scheduler`

### **Étape 2: Ajouter les Fichiers Java**

Pour chaque fichier `.java`:

1. **Clic droit** sur le package cible
2. **New** → **Java Class**
3. Copier-coller le code

#### **Fichiers à créer:**

```
models/
  └── Notification.java                   ← À AJOUTER

repositories/
  └── NotificationRepository.java         ← À AJOUTER

services/
  └── NotificationService.java            ← À AJOUTER

controllers/
  └── NotificationController.java         ← À AJOUTER

dtos/
  └── NotificationDTO.java                ← À AJOUTER

config/
  └── CorsConfig.java                     ← À AJOUTER

scheduler/
  └── NotificationScheduler.java          ← À AJOUTER
```

### **Étape 3: Ajouter le Fichier SQL**

1. Créer le dossier `src/main/resources/db/migration/`
   - Clic droit sur `resources/`
   - New → Directory → `db/migration`

2. Créer le fichier de migration:
   - Clic droit sur `db/migration/`
   - New → File → `V1__create_notifications.sql`
   - Copier le contenu SQL

### **Étape 4: Modifier application.properties**

Ouvrir `src/main/resources/application.properties` et ajouter:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/pidev_db
spring.datasource.username=root
spring.datasource.password=root

# Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# CORS
server.servlet.context-path=/api

# Logging
logging.level.org.hibernate.SQL=DEBUG
```

### **Étape 5: Modifier pom.xml**

Ouvrir `pom.xml` et ajouter dans `<dependencies>`:

```xml
<!-- Spring Data JPA -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- MySQL Driver -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>8.0.33</version>
</dependency>

<!-- Lombok (optionnel) -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

Après modification, **Maven** devrait automatiquement télécharger les dépendances.

---

## 🔄 Procédure Complète Étape par Étape

### **1. Préparation**
```
File → Project Structure (Ctrl+Shift+Alt+S)
Vérifier que le SDK Java est ajouté
Vérifier que Maven est comme build system
```

### **2. Créer les Packages**
```
src/main/java/com/pidev/
├── Right-click → New → Package
  ├── models
  ├── repositories
  ├── services
  ├── controllers
  ├── dtos
  ├── config
  └── scheduler
```

### **3. Ajouter les Classes Java**
Pour chaque fichier `.java` de mon guide:
```
Right-click sur le package → New → Java Class
Copier-coller le contenu du fichier
```

### **4. Ajouter le Fichier SQL**
```
src/main/resources/
├── Right-click → New → Directory
  └── db/migration (créer ce chemin)
     └── Right-click → New → File
        └── V1__create_notifications.sql
           └── Copier le SQL dedans
```

### **5. Modifier les Fichiers de Config**
```
pom.xml
└── Ajouter les dépendances

application.properties
└── Ajouter la configuration DB
```

### **6. Maven Refresh**
```
File → Invalidate Caches and Restart
Puis: Maven → Reimport All Maven Projects
```

---

## 📋 Checklist Visuelle IntelliJ

```
✅ Dossier src/main/java/com/pidev/
   ├── ✅ models/ (avec Notification.java)
   ├── ✅ repositories/ (avec NotificationRepository.java)
   ├── ✅ services/ (avec NotificationService.java)
   ├── ✅ controllers/ (avec NotificationController.java)
   ├── ✅ dtos/ (avec NotificationDTO.java)
   ├── ✅ config/ (avec CorsConfig.java)
   └── ✅ scheduler/ (avec NotificationScheduler.java)

✅ Dossier src/main/resources/
   ├── ✅ application.properties (MODIFIÉ)
   ├── ✅ db/
   │   └── migration/
   │       └── ✅ V1__create_notifications.sql

✅ Fichier pom.xml (MODIFIÉ)
```

---

## 🎯 Résumé en 2 Minutes

### **Fichiers Java à Créer (7 fichiers)**

| Package | Fichier | Action |
|---------|---------|--------|
| `models` | `Notification.java` | Copier du guide |
| `repositories` | `NotificationRepository.java` | Copier du guide |
| `services` | `NotificationService.java` | Copier du guide |
| `controllers` | `NotificationController.java` | Copier du guide |
| `dtos` | `NotificationDTO.java` | Copier du guide |
| `config` | `CorsConfig.java` | Copier du guide |
| `scheduler` | `NotificationScheduler.java` | Copier du guide |

### **Fichiers à Modifier (3 fichiers)**

| Fichier | Action |
|---------|--------|
| `pom.xml` | Ajouter 3 `<dependency>` |
| `application.properties` | Ajouter config DB |
| `src/main/resources/db/migration/` | Créer V1__create_notifications.sql |

---

## 🚀 Après l'Ajout

1. **Maven Refresh** (Ctrl+Shift+F10 sur pom.xml)
2. **Build Project** (Ctrl+F9)
3. **Démarrer** (Shift+F10)

Si tout est bon : **Server démarre sur port 8080** ✅

---

## 🐛 Problèmes Courants

### **Classes non reconnues**
```
→ File → Invalidate Caches and Restart
```

### **Import errors**
```
→ Maven → Reimport All Maven Projects
```

### **Port 8080 occupé**
```
Dans application.properties:
server.port=8081
```

### **Erreur de base de données**
```
Vérifier que:
- MySQL est démarré
- URL de connexion est correcte
- Identifiants sont corrects
```

---

**Prêt à commencer ? Créez d'abord les dossiers, puis les fichiers Java ! 🎉**
