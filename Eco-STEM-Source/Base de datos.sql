-- ============================================================
-- EcoStemDB - Script ajustado al frontend (app.js)
-- ============================================================

IF DB_ID('EcoStemDB') IS NULL
BEGIN
    CREATE DATABASE EcoStemDB;
END;
GO

USE EcoStemDB;
GO

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'app')
BEGIN
    EXEC('CREATE SCHEMA app');
END;
GO

-- ============================================================
-- USUARIOS
-- ============================================================
IF OBJECT_ID('app.Users', 'U') IS NULL
CREATE TABLE app.Users (
    UserId UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    FirstName NVARCHAR(120) NOT NULL,
    LastName NVARCHAR(120) NULL,
    Email NVARCHAR(190) NULL,
    Phone NVARCHAR(40) NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    PlanStatus NVARCHAR(30) NOT NULL DEFAULT 'free',
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_Users_Email UNIQUE (Email),
    CONSTRAINT UQ_Users_Phone UNIQUE (Phone)
);
GO

-- ============================================================
-- SESIONES
-- ============================================================
IF OBJECT_ID('app.Sessions', 'U') IS NULL
CREATE TABLE app.Sessions (
    SessionId UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    UserAgent NVARCHAR(400) NULL,
    IpAddress NVARCHAR(64) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    ExpiresAt DATETIME2 NULL,
    RevokedAt DATETIME2 NULL,
    CONSTRAINT FK_Sessions_Users FOREIGN KEY (UserId) REFERENCES app.Users(UserId)
);
GO

-- ============================================================
-- SUSCRIPCIONES
-- ============================================================
IF OBJECT_ID('app.Subscriptions', 'U') IS NULL
CREATE TABLE app.Subscriptions (
    SubscriptionId UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    PlanCode NVARCHAR(50) NOT NULL,
    PlanName NVARCHAR(120) NOT NULL,
    Status NVARCHAR(30) NOT NULL,
    StartDate DATETIME2 NOT NULL,
    EndDate DATETIME2 NOT NULL,
    AutoRenew BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Subscriptions_Users FOREIGN KEY (UserId) REFERENCES app.Users(UserId)
);
GO

-- ============================================================
-- PAGOS
-- ============================================================
IF OBJECT_ID('app.Payments', 'U') IS NULL
CREATE TABLE app.Payments (
    PaymentId UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    SubscriptionId UNIQUEIDENTIFIER NULL,
    Amount DECIMAL(12,2) NOT NULL,
    CurrencyCode CHAR(3) NOT NULL DEFAULT 'USD',
    PaymentMethod NVARCHAR(40) NOT NULL,
    MaskedCard NVARCHAR(30) NULL,
    ProviderReference NVARCHAR(120) NULL,
    Status NVARCHAR(40) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Payments_Users FOREIGN KEY (UserId) REFERENCES app.Users(UserId),
    CONSTRAINT FK_Payments_Subscriptions FOREIGN KEY (SubscriptionId) REFERENCES app.Subscriptions(SubscriptionId)
);
GO

-- ============================================================
-- ANALISIS DE PLANTAS
-- ============================================================
IF OBJECT_ID('app.Analyses', 'U') IS NULL
CREATE TABLE app.Analyses (
    AnalysisId UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NULL,
    SourceType NVARCHAR(40) NOT NULL,
    Severity NVARCHAR(30) NOT NULL,
    Confidence DECIMAL(5,2) NULL,
    Summary NVARCHAR(MAX) NOT NULL,
    LocationLatitude DECIMAL(10,7) NULL,
    LocationLongitude DECIMAL(10,7) NULL,
    SensorMoisture DECIMAL(5,2) NULL,
    SensorTemperature DECIMAL(5,2) NULL,
    SensorLight DECIMAL(5,2) NULL,
    SoilPh DECIMAL(4,2) NULL,
    SensorHumidity DECIMAL(5,2) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Analyses_Users FOREIGN KEY (UserId) REFERENCES app.Users(UserId)
);
GO

-- ============================================================
-- MENSAJES DE CONTACTO
-- ============================================================
IF OBJECT_ID('app.ContactMessages', 'U') IS NULL
CREATE TABLE app.ContactMessages (
    MessageId UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NULL,
    FullName NVARCHAR(180) NOT NULL,
    Email NVARCHAR(190) NOT NULL,
    Subject NVARCHAR(180) NOT NULL,
    MessageBody NVARCHAR(MAX) NOT NULL,
    WhatsAppSent BIT NOT NULL DEFAULT 0,
    EmailSent BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_ContactMessages_Users FOREIGN KEY (UserId) REFERENCES app.Users(UserId)
);
GO

-- ============================================================
-- NOTIFICACIONES
-- ============================================================
IF OBJECT_ID('app.Notifications', 'U') IS NULL
CREATE TABLE app.Notifications (
    NotificationId UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NULL,
    Channel NVARCHAR(30) NOT NULL,
    TargetAddress NVARCHAR(190) NOT NULL,
    Subject NVARCHAR(250) NULL,
    MessageBody NVARCHAR(MAX) NOT NULL,
    Status NVARCHAR(30) NOT NULL DEFAULT 'queued',
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    SentAt DATETIME2 NULL,
    CONSTRAINT FK_Notifications_Users FOREIGN KEY (UserId) REFERENCES app.Users(UserId)
);
GO

-- ============================================================
-- NEWSLETTER
-- ============================================================
IF OBJECT_ID('app.NewsletterSubscriptions', 'U') IS NULL
CREATE TABLE app.NewsletterSubscriptions (
    NewsletterSubId UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NULL,
    Email NVARCHAR(190) NOT NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'active',
    Source NVARCHAR(30) NOT NULL DEFAULT 'local',
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_Newsletter_Email UNIQUE (Email),
    CONSTRAINT FK_Newsletter_Users FOREIGN KEY (UserId) REFERENCES app.Users(UserId)
);
GO

-- ============================================================
-- COOKIES
-- ============================================================
IF OBJECT_ID('app.CookieConsents', 'U') IS NULL
CREATE TABLE app.CookieConsents (
    ConsentId UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NULL,
    ConsentType NVARCHAR(50) NOT NULL DEFAULT 'cookies',
    ConsentValue NVARCHAR(30) NOT NULL,
    Version NVARCHAR(20) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_CookieConsents_Users FOREIGN KEY (UserId) REFERENCES app.Users(UserId)
);
GO

-- ============================================================
-- INDICES DE RENDIMIENTO (idempotentes)
-- ============================================================
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Analyses_UserId_CreatedAt')
    DROP INDEX IX_Analyses_UserId_CreatedAt ON app.Analyses;
CREATE INDEX IX_Analyses_UserId_CreatedAt ON app.Analyses(UserId, CreatedAt DESC);
GO

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Payments_UserId_CreatedAt')
    DROP INDEX IX_Payments_UserId_CreatedAt ON app.Payments;
CREATE INDEX IX_Payments_UserId_CreatedAt ON app.Payments(UserId, CreatedAt DESC);
GO

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Subscriptions_UserId')
    DROP INDEX IX_Subscriptions_UserId ON app.Subscriptions;
CREATE INDEX IX_Subscriptions_UserId ON app.Subscriptions(UserId);
GO

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Notifications_UserId_CreatedAt')
    DROP INDEX IX_Notifications_UserId_CreatedAt ON app.Notifications;
CREATE INDEX IX_Notifications_UserId_CreatedAt ON app.Notifications(UserId, CreatedAt DESC);
GO

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Newsletter_Email')
    DROP INDEX IX_Newsletter_Email ON app.NewsletterSubscriptions;
CREATE INDEX IX_Newsletter_Email ON app.NewsletterSubscriptions(Email);
GO

-- ============================================================
-- VERIFICACION FINAL
-- ============================================================
SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'app'
ORDER BY TABLE_NAME;
GO
