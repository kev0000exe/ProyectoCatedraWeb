# ProyectoCatedraWeb

ELIMINAR LA TiendasDbContext EN LA CARPETA DATA Y OCUPAR NET 8

Para poder conectar una base de datos a nuestro proyecto tiene que tener una base de datos con el siguiente nombre CafeAirRodCoffe 
# TiendasAPI

API RESTful desarrollada con ASP.NET Core y Entity Framework Core para gestionar usuarios, tiendas, productos, pedidos, servicios, eventos, calificaciones y favoritos.

## Tecnologías utilizadas

- ASP.NET Core 8
- Entity Framework Core
- SQL Server
- Swagger (OpenAPI)
- Visual Studio / Visual Studio Code

---
importante tener instalados si no comensara a presentar problemas con los paquetes nuggets
##  Requisitos previos

- [.NET SDK 8.0](https://dotnet.microsoft.com/en-us/download)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- (Opcional) [Visual Studio 2022+](https://visualstudio.microsoft.com/) o VS Code
- (Opcional) [Postman](https://www.postman.com/) para probar la API

---

## ⚙️ Configuración del entorno

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo


Configura tu cadena de conexión en appsettings.json

"ConnectionStrings": {
  "DefaultConnection": "Server=.;Database=CafeAirRodCoffe;Trusted_Connection=True;"
}

importante ver que datos les estamos dando ya que si ay un error no va permitir hacer las migraciones
Antes de ejecutar las migraciones, asegúrate de que existe una base de datos en SQL Server con el nombre CafeAirRodCoffe (o el que hayas configurado en appsettings.json). Puedes crearla manualmente desde SQL Server Management Studio o con un script SQL.

Luego, ejecuta el siguiente comando en la raíz del proyecto para aplicar las migraciones y crear todas las tablas necesarias:

dotnet ef database update
Después de ejecutar este comando, puedes verificar en SQL Server que las tablas hayan sido creadas correctamente.
