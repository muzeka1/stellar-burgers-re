import { setCookie } from "../../../src/utils/cookie"

describe('проверка конструктора бургера', () => {
    beforeEach(() => {
        cy.intercept('GET', `https://norma.nomoreparties.space/api/ingredients`, { fixture: 'ingredients.json' }).as('getIngredients');
        cy.intercept('GET', `https://norma.nomoreparties.space/api/auth/user`, { fixture: 'user.json' }).as('getUser');
        cy.intercept('POST', `https://norma.nomoreparties.space/api/orders`, { fixture: 'successedOrder.json' }).as('getOrder');
        cy.window().then((win) => {
            setCookie('accessToken', 'access-token')
            win.localStorage.setItem('refreshToken', 'refresh-token')
        })
        
        cy.visit('http://localhost:4000/');
    });
    it('тест получения ингредиентов', () => {
        cy.wait('@getIngredients');
        cy.get('[data-cy=ingredientItem]').should('have.length', 3)
        cy.contains('Краторная булка N-200i').should('be.visible');
        cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
        cy.contains('Соус Spicy-X').scrollIntoView().should('be.visible');
    })
    it('добавление ингредиентов в конструктор', () => {
        cy.get('button').filter(':contains("Добавить")').eq(0).click({ force: true })
        cy.get('[data-cy=constructor]').contains('Краторная булка N-200i').should('be.visible');

        cy.get('button').filter(':contains("Добавить")').eq(1).click({ force: true })
        cy.get('[data-cy=constructor]').contains('Биокотлета из марсианской Магнолии').should('be.visible');

        cy.get('button').filter(':contains("Добавить")').eq(2).click({ force: true })
        cy.get('[data-cy=constructor]').contains('Соус Spicy-X').should('be.visible');

        cy.get('button').filter(':contains("Добавить")').eq(1).click({ force: true })

        cy.get('[data-cy=constructor]').find('li').should('have.length', 3)
    })
    it('проверка модального окна', () => {
        cy.get('[data-cy=ingredients]').find('a').eq(0).click()
        cy.contains('Детали ингредиента').should('be.visible')
        cy.get('[data-cy=closeModalButton]').click()
        cy.contains('Детали ингредиента').should('not.exist');
        cy.get('[data-cy=ingredients]').find('a').eq(0).click()
        cy.get('[data-cy=modalOverlay]').click({ force: true })
        cy.contains('Детали ингредиента').should('not.exist');
    })
    it('проверка на создание заказа', () => {
        cy.get('button').filter(':contains("Добавить")').eq(0).click({ force: true })
        cy.get('button').filter(':contains("Оформить заказ")').eq(0).click({ force: true })
        cy.contains('Ваш заказ начали готовить').should('be.visible')
        cy.contains('70770').should('be.visible')
        cy.get('[data-cy=closeModalButton]').click()
        cy.contains('Ваш заказ начали готовить').should('not.exist')
        cy.contains('Выберите булки').should('be.visible')
        cy.contains('Выберите начинку').should('be.visible')
    })
})