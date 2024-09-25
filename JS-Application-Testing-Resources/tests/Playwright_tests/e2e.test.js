const { test, describe, beforeEach, afterEach, beforeAll, afterAll, expect } = require('@playwright/test');
const { chromium } = require('playwright');

const host = 'http://localhost:3000'; // Application host (NOT service host - that can be anything)

let browser;
let context;
let page;

let user = {
    email : "",
    password : "123456",
    confirmPass : "123456",
};

let albumName = "";

describe("e2e tests", () => {
    beforeAll(async () => {
        browser = await chromium.launch();
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
    });

    afterEach(async () => {
        await page.close();
        await context.close();
    });

    
    describe("authentication", () => {
        test('register makes correct API call', async () => {
            // arrange
            await page.goto(host);
            await page.click('text=Register');
            await page.waitForSelector('form');

            let random = Math.floor(Math.random() * 10000);
            user.email = `abv${random}@abv.bg`;

            // act
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password);
            await page.locator('#conf-pass').fill(user.confirmPass);
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/users/register') && response.status() === 200),
                page.click('[type="submit"]')
            ]);
            let userData = await response.json();

            // assert
            console.log(userData);
            await expect(response.ok()).toBeTruthy();
            expect(userData.email).toBe(user.email);
            expect(userData.password).toEqual(user.password);

        });

        test('login makes correct API call', async () => {
            // arrange
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');

            // act
            await page.locator("#email").fill(user.email);
            await page.locator("#password").fill(user.password);
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/users/login") && response.status() === 200),
                page.click('[type="submit"]')
            ]);
            let userData = await response.json();

            // assert
            console.log(userData);
            await expect(response.ok()).toBeTruthy();
            expect(userData.email).toBe(user.email);
            expect(userData.password).toEqual(user.password);

        });

        test('logout makes correct API call', async () => {
            // arrange
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');            
            await page.locator("#email").fill(user.email);
            await page.locator("#password").fill(user.password);
            await page.click('[type="submit"]');

            // act
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/users/logout") && response.status() === 204),
                page.click('nav >> text=Logout')
                
            ]);

            // assert
            expect(response.ok).toBeTruthy();
            await page.waitForSelector('nav >> text=Login');

            expect(page.url()).toBe(host + "/");
        });
        
    });

    describe("navbar", () => {
        test('logged user should see correct navigation', async () => {     
            //act
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');            
            await page.locator("#email").fill(user.email);
            await page.locator("#password").fill(user.password);
            await page.click('[type="submit"]');            

            // assert
            await expect(page.locator('nav >> text=Home')).toBeVisible();
            await expect(page.locator('nav >> text=Catalog')).toBeVisible();
            await expect(page.locator('nav >> text=Search')).toBeVisible();
            await expect(page.locator('nav >> text=Create Album')).toBeVisible();
            await expect(page.locator('nav >> text=Logout')).toBeVisible();

            await expect(page.locator('nav >> text=Login')).toBeHidden();
            await expect(page.locator('nav >> text=Register')).toBeHidden();

        });

        test('logout makes correct API call', async () => {
            // act
            await page.goto(host);

            // assert
            await expect(page.locator('nav >> text=Home')).toBeVisible();
            await expect(page.locator('nav >> text=Catalog')).toBeVisible();
            await expect(page.locator('nav >> text=Search')).toBeVisible();
            await expect(page.locator('nav >> text=Login')).toBeVisible();
            await expect(page.locator('nav >> text=Register')).toBeVisible();

            await expect(page.locator('nav >> text=Create Album')).toBeHidden();
            await expect(page.locator('nav >> text=Logout')).toBeHidden();
        });
        
    });

    describe("CRUD", () => {
        beforeEach(async () => {
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');
            await page.locator("#email").fill(user.email);
            await page.locator("#password").fill(user.password);
            await page.click('[type="submit"]')
        });

        test('create makes correct API call for logged in user', async () => {
            // arrange
            await page.click('text=Create Album');
            await page.waitForSelector('form');
            let random = Math.floor(Math.random() * 10000);
            let randomAlbumName = `Album${random}`;
            

            // act
            await page.fill('[name="name"]', randomAlbumName);
            await page.fill('[name="imgUrl"]', '/images/pinkFloyd.jpg');
            await page.fill('[name="price"]', '15.25');
            await page.fill('[name="releaseDate"]', '29 June 2024');
            await page.fill('[name="artist"]', 'Unknown');
            await page.fill('[name="genre"]', 'Random Genre');
            await page.fill('[name="description"]', 'Random description');
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/data/albums") && response.status() === 200),
                page.click('[type="submit"]')
            ]);
            let eventData = await response.json();
            
            
            // assert
            console.log(eventData);
            expect(eventData.name).toEqual(randomAlbumName);
            expect(eventData.imgUrl).toEqual('/images/pinkFloyd.jpg');
            expect(eventData.price).toEqual('15.25');
            expect(eventData.releaseDate).toEqual('29 June 2024');
            expect(eventData.artist).toEqual('Unknown');
            expect(eventData.genre).toEqual('Random Genre');
            expect(eventData.description).toEqual('Random description');


        });

        test('edit makes correct API call', async () => {
            // arrange
            await page.locator(`text=Search`).first().click();
            await page.click('text=Search');            
            await page.waitForSelector('form');
            await page.locator('#search-input');
            await page.fill('#search-input', 'Melodrama');
            await page.click('.button-list');
            await page.locator(`#details`).first().click();

            // act
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/data/albums") && response.status() === 200),
                await page.click('text=Delete')
            ]);

            // assert
            expect(response.ok()).toBeTruthy();

        });

        test('delete makes correct API call', async () => {
            // arrange
            await page.locator('nav >> text=Search');
            await page.click('text=Search');            
            await page.waitForSelector('form');


            // act

            // assert

        });


        
    });
});