## CLI Commands

- Kill process using port `3000`
```bash
kill -9 $(lsof -t -i :3000)
```
