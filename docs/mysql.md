# Banco de dados mysql
---

## Acessando o MySQL no Docker
O banco de dados roda em um container configurado pelo `docker-compose.yml`.


### Entrar no container
```bash
docker exec -it infra-db-1 mysql -uuser -ppassword cinema
```

---

### Comandos SQL úteis
- Listar tabelas:
  ```sql
  SHOW TABLES;
  ```
- Consultar usuários cadastrados:
  ```sql
  SELECT * FROM usuario;
  ```
- Limpar todos os dados:
  ```sql
  DELETE FROM usuario;
  ```
- Resetar completamente o banco:
  ```bash
  docker volume rm infra_mysql_data
  ```

