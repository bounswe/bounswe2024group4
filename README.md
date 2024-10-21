# bounswe2024group4
BOUN SWE 2024 Group 4

This is the repository for the BOUN SWE Group 4.

---

## Group Members
* [Berat Yılmaz](https://github.com/bounswe/bounswe2024group4/wiki/Berat-Yılmaz)
* [Bilge Kaan Güneyli](https://github.com/bounswe/bounswe2024group4/wiki/Bilge-Kaan-Güneyli)
* [Fatih Demir](https://github.com/bounswe/bounswe2024group4/wiki/Fatih-Demir)
* [Murat Can Kocakulak](https://github.com/bounswe/bounswe2024group4/wiki/Murat-Can-Kocakulak)
* [Zeynep Buse Aydın](https://github.com/bounswe/bounswe2024group4/wiki/Zeynep-Buse-Ayd%C4%B1n)
* [Nurullah Uçan](https://github.com/bounswe/bounswe2024group4/wiki/Nurullah-Uçan)
* [Ceyhun Sonyürek](https://github.com/bounswe/bounswe2024group4/wiki/Ceyhun-Sonyürek)
* [Ahmet Batuhan Canlı](https://github.com/bounswe/bounswe2024group4/wiki/Ahmet-Batuhan-Canlı)
* [Ümmü Sena Özpınar](https://github.com/bounswe/bounswe2024group4/wiki/%C3%9Cmm%C3%BC-Sena-%C3%96zp%C4%B1nar)
* [Talha Ordukaya](https://github.com/bounswe/bounswe2024group4/wiki/Talha-Ordukaya)
* [Miraç Öztürk](https://github.com/bounswe/bounswe2024group4/wiki/Mira%C3%A7-%C3%96zt%C3%BCrk)
---

You can check our [wiki](https://github.com/bounswe/bounswe2024group4/wiki) for further information.


To run the project, put the following as .env in the root folder:

```
DB_HOST=db
DB_NAME=fitness_database
DB_USER=root
DB_PASSWORD=admin_group4_dbfitness123
DB_PORT=3306
DB_ROOT_PASSWORD=admin_group4_dbfitness123
EXERCISES_API_KEY=<Your API Ninjas Exercises API Key>
```

You can get your personal `Exercises API` key by creating an account in `Ninjas API`s [website] (https://www.api-ninjas.com/api/exercises).

Also note that the variable `MYSQL_USER` is assigned to `django_user` in the `docker-compose.yaml` file 

Then run the command `docker-compose up` or `docker compose up`. (Developer's suggestion is using the latter with Docker Desktop downloaded on your device)

To run the project locally without containerization, consult the `README`s of `backend`, `frontend` and `mobile` directories. 
