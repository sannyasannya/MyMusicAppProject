const baseUrl = 'http://localhost:3030/';

let user = {
    "email": "",
    "password": "123456"
};

let token = "";
let userId = "";

let lastCreatedAlbumId = '';
let album = {
    name: '',
    artist: '',
    description: '',
    genre: '',
    imgUrl: '/images/pinkFloyd.jpg',
    price: '',
    releaseDate: '29 June 2024'
};

QUnit.config.reorder = false;

QUnit.module("user functionalities", () => {
    QUnit.test("user registration", async (assert) => {
        // arrange
        let path = 'users/register';
        let random = Math.floor(Math.random() * 10000);
        let email = `abv${random}@abv.bg`;

        user.email = email;

        // act
        let response = await fetch(baseUrl + path, {
            method : 'POST',
            headers : { 
                'content-type' : 'application/json'
             },
            body : JSON.stringify(user)
        });
        let json = await response.json();

        // assert
        console.log(json);
        assert.ok(response.ok, "successful response");

        assert.ok(json.hasOwnProperty('email'), "email exist");
        assert.equal(json['email'], user.email, "expected email");
        assert.strictEqual(typeof json.email, 'string', 'Property "email" is a string');

        assert.ok(json.hasOwnProperty('password'), "password exist");
        assert.equal(json['password'], user.password, "expected password");
        assert.strictEqual(typeof json.password, 'string', 'Property "password" is a string');

        assert.ok(json.hasOwnProperty('_createdOn'), "_createdOn exist");
        assert.strictEqual(typeof json._createdOn, 'number', 'Property "_createdOn" has correct type');

        assert.ok(json.hasOwnProperty('accessToken'), "accessToken exist");
        assert.strictEqual(typeof json.accessToken, 'string', 'Property "accessToken" is a string');

        assert.ok(json.hasOwnProperty('_id'), "id exist");
        assert.strictEqual(typeof json._id, 'string', 'Property "_id" is a string');

        token = json['accessToken'];
        userId = json['_id'];
        sessionStorage.setItem('music-user', JSON.stringify(user));
    });


    QUnit.test("user login", async (assert) => {
        // arrange
        let path = 'users/login';

        // act
        let response = await fetch(baseUrl + path, {
            method : 'POST',
            headers : { 
                'content-type' : 'application/json'
             },
             body : JSON.stringify({
                email: user.email,
                password: user.password
            })
        });
        let json = await response.json();

        // assert
        console.log(json);
        assert.ok(response.ok, "successful response");

        assert.ok(json.hasOwnProperty('email'), "email exist");
        assert.equal(json['email'], user.email, "expected email");
        assert.strictEqual(typeof json.email, 'string', 'Property "email" is a string');

        assert.ok(json.hasOwnProperty('password'), "password exist");
        assert.equal(json['password'], user.password, "expected password");
        assert.strictEqual(typeof json.password, 'string', 'Property "password" is a string');

        assert.ok(json.hasOwnProperty('_createdOn'), "_createdOn exist");
        assert.strictEqual(typeof json._createdOn, 'number', 'Property "_createdOn" has correct type');

        assert.ok(json.hasOwnProperty('accessToken'), "accessToken exist");
        assert.strictEqual(typeof json.accessToken, 'string', 'Property "accessToken" is a string');

        assert.ok(json.hasOwnProperty('_id'), "id exist");
        assert.strictEqual(typeof json._id, 'string', 'Property "_id" is a string');

        token = json['accessToken'];
        userId = json['_id'];
        sessionStorage.setItem('music-user', JSON.stringify(user));
    });

});

QUnit.module("album functionalities", () => {
    QUnit.test("get all albums", async (assert) => {
        // arrange
        let path = 'data/albums';
        let queryParam = '?sortBy=_createdOn%20desc&distinct=name';

        // act
        let response = await fetch(baseUrl + path + queryParam);
        let json = await response.json();

        // assert
        console.log(json);
        assert.ok(response.ok, "successful response");

        assert.ok(Array.isArray(json), "response is array");

        json.forEach(json => {
            assert.ok(json.hasOwnProperty('artist'), 'Property "artist" exists');
            assert.strictEqual(typeof json.artist, 'string', 'Property "artist" is from correct type');

            assert.ok(json.hasOwnProperty('description'), 'Property "description" exists');
            assert.strictEqual(typeof json.description, 'string', 'Property "description" is from correct type');

            assert.ok(json.hasOwnProperty('imgUrl'), 'Property "imgUrl" exists');
            assert.strictEqual(typeof json.imgUrl, 'string', 'Property "imgUrl" is from correct type');

            assert.ok(json.hasOwnProperty('name'), 'Property "name" exists');
            assert.strictEqual(typeof json.name, 'string', 'Property "name" is from correct type');

            assert.ok(json.hasOwnProperty('price'), 'Property "price" exists');
            assert.strictEqual(typeof json.price, 'string', 'Property "price" is from correct type');

            assert.ok(json.hasOwnProperty('releaseDate'), 'Property "releaseDate" exists');
            assert.strictEqual(typeof json.releaseDate, 'string', 'Property "releaseDate" is from correct type');

            assert.ok(json.hasOwnProperty('_createdOn'), 'Property "_createdOn" exists');
            assert.strictEqual(typeof json._createdOn, 'number', 'Property "_createdOn" is from correct type');

            assert.ok(json.hasOwnProperty('_id'), 'Property "_id" exists');
            assert.strictEqual(typeof json._id, 'string', 'Property "_id" is from correct type');

            assert.ok(json.hasOwnProperty('_ownerId'), 'Property "_ownerId" exists');
            assert.strictEqual(typeof json._ownerId, 'string', 'Property "_ownerId" is from correct type');
        });

    });

    QUnit.test("create an album", async (assert) => {
        // arrange
        let path = 'data/albums';

        let random = Math.floor(Math.random() * 100000);

        album.title = `Random album title_${random}`;
        album.description = `Random album description ${random}`;

        // act
        let response = await fetch(baseUrl + path, {
            method : 'POST',
            headers : {
                'content-type' : 'application/json',
                'X-Authorization' : token
            },
            body : JSON.stringify(album)
        });

        let json = await response.json();

        // assert
        console.log(json);
        assert.ok(response.ok, "successful response");
        

        assert.ok(json.hasOwnProperty('name'), 'Property "name" exists');
        assert.strictEqual(typeof json.name, 'string', 'Property "name" is a string');
        assert.strictEqual(json.name, album.name, 'Property "name" has the correct value');

        assert.ok(json.hasOwnProperty('artist'), 'Property "artist" exists');
        assert.strictEqual(typeof json.artist, 'string', 'Property "artist" is a string');
        assert.strictEqual(json.artist, album.artist, 'Property "artist" has the correct value');

        assert.ok(json.hasOwnProperty('description'), 'Property "description" exists');
        assert.strictEqual(typeof json.description, 'string', 'Property "description" is a string');
        assert.strictEqual(json.description, album.description, 'Property "description" has the correct value');

        assert.ok(json.hasOwnProperty('genre'), 'Property "genre" exists');
        assert.strictEqual(typeof json.genre, 'string', 'Property "genre" is a string');
        assert.strictEqual(json.genre, album.genre, 'Property "genre" has the correct value');

        assert.ok(json.hasOwnProperty('imgUrl'), 'Property "imgUrl" exists');
        assert.strictEqual(typeof json.imgUrl, 'string', 'Property "imgUrl" is a string');
        assert.strictEqual(json.imgUrl, album.imgUrl, 'Property "imgUrl" has the correct value');

        assert.ok(json.hasOwnProperty('price'), 'Property "price" exists');
        assert.strictEqual(typeof json.price, 'string', 'Property "price" is a string');
        assert.strictEqual(json.price, album.price, 'Property "price" has the correct value');

        assert.ok(json.hasOwnProperty('releaseDate'), 'Property "releaseDate" exists');
        assert.strictEqual(typeof json.releaseDate, 'string', 'Property "releaseDate" is a string');
        assert.strictEqual(json.releaseDate, album.releaseDate, 'Property "releaseDate" has the correct value');

        assert.ok(json.hasOwnProperty('title'), 'Property "title" exists');
        assert.strictEqual(typeof json.title, 'string', 'Property "title" is a string');
        assert.strictEqual(json.title, album.title, 'Property "title" has the correct value');

        assert.ok(json.hasOwnProperty('_createdOn'), 'Property "_createdOn" exists');
        assert.strictEqual(typeof json._createdOn, 'number', 'Property "_createdOn" is a number');

        assert.ok(json.hasOwnProperty('_id'), 'Property "_id" exists');
        assert.strictEqual(typeof json._id, 'string', 'Property "_id" is a string');

        lastCreatedAlbumId = json._id;

        assert.ok(json.hasOwnProperty('_ownerId'), 'Property "_ownerId" exists');
        assert.strictEqual(typeof json._ownerId, 'string', 'Property "_ownerId" is a string');
        assert.strictEqual(json._ownerId, userId, 'Property "_ownerId" has the correct value');

    });

    QUnit.test("edit an album", async (assert) => {
        // arrange
        let path = 'data/albums';

        let random = Math.floor(Math.random() * 100000);

        album.title = `Edited album title_${random}`;

        // act
        let response = await fetch(baseUrl + path + `/${lastCreatedAlbumId}`, {
            method : 'PUT',
            headers : {
                'content-type' : 'application/json',
                'X-Authorization' : token
            },
            body : JSON.stringify(album)
        });
        let json = await response.json();

        // assert
        console.log(json);
        assert.ok(response.ok, "successful response");

        assert.ok(json.hasOwnProperty('name'), 'Property "name" exists');
        assert.strictEqual(typeof json.name, 'string', 'Property "name" is a string');
        assert.strictEqual(json.name, album.name, 'Property "name" has the correct value');

        assert.ok(json.hasOwnProperty('artist'), 'Property "artist" exists');
        assert.strictEqual(typeof json.artist, 'string', 'Property "artist" is a string');
        assert.strictEqual(json.artist, album.artist, 'Property "artist" has the correct value');

        assert.ok(json.hasOwnProperty('description'), 'Property "description" exists');
        assert.strictEqual(typeof json.description, 'string', 'Property "description" is a string');
        assert.strictEqual(json.description, album.description, 'Property "description" has the correct value');

        assert.ok(json.hasOwnProperty('genre'), 'Property "genre" exists');
        assert.strictEqual(typeof json.genre, 'string', 'Property "genre" is a string');
        assert.strictEqual(json.genre, album.genre, 'Property "genre" has the correct value');

        assert.ok(json.hasOwnProperty('imgUrl'), 'Property "imgUrl" exists');
        assert.strictEqual(typeof json.imgUrl, 'string', 'Property "imgUrl" is a string');
        assert.strictEqual(json.imgUrl, album.imgUrl, 'Property "imgUrl" has the correct value');

        assert.ok(json.hasOwnProperty('price'), 'Property "price" exists');
        assert.strictEqual(typeof json.price, 'string', 'Property "price" is a string');
        assert.strictEqual(json.price, album.price, 'Property "price" has the correct value');

        assert.ok(json.hasOwnProperty('releaseDate'), 'Property "releaseDate" exists');
        assert.strictEqual(typeof json.releaseDate, 'string', 'Property "releaseDate" is a string');
        assert.strictEqual(json.releaseDate, album.releaseDate, 'Property "releaseDate" has the correct value');

        assert.ok(json.hasOwnProperty('title'), 'Property "title" exists');
        assert.strictEqual(typeof json.title, 'string', 'Property "title" is a string');
        assert.strictEqual(json.title, album.title, 'Property "title" has the correct value');

        assert.ok(json.hasOwnProperty('_createdOn'), 'Property "_createdOn" exists');
        assert.strictEqual(typeof json._createdOn, 'number', 'Property "_createdOn" is a number');

        assert.ok(json.hasOwnProperty('_id'), 'Property "_id" exists');
        assert.strictEqual(typeof json._id, 'string', 'Property "_id" is a string');

        lastCreatedAlbumId = json._id;

        assert.ok(json.hasOwnProperty('_ownerId'), 'Property "_ownerId" exists');
        assert.strictEqual(typeof json._ownerId, 'string', 'Property "_ownerId" is a string');
        assert.strictEqual(json._ownerId, userId, 'Property "_ownerId" has the correct value');

        assert.ok(json.hasOwnProperty('_updatedOn'), 'Property "_updatedOn" exists');
        assert.strictEqual(typeof json._updatedOn, 'number', 'Property "_ownerId" is a number');        

    });

    QUnit.test("delete an album", async (assert) => {
        // arrange
        let path = 'data/albums';

        // act
        let response = await fetch(baseUrl + path + `/${lastCreatedAlbumId}`, {
            method : 'DELETE',
            headers : {'X-Authorization' : token}
        });

        // assert
        assert.ok(response.ok, "successful response");
    });

});

