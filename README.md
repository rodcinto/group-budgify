<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# GroupBudgify

GroupBudgify is a project for group expense tracking. It simplifies managing shared expenses among friends, family, or roommates by tracking contributions, balances, and settling debts within the group. The app also sends notifications for new expenses and updates to keep everyone informed.

## About this project

- It should be a group expense tracking.
- **GroupBudgify** simplifies managing shared expenses among friends, family, or roommates. Users can create groups for specific events or ongoing shared expenses. The app tracks individual contributions, balances, and settles debts within the group. It also sends notifications for new expenses and updates, ensuring everyone stays informed about financial transactions within the group.

    ### Core operations

    - Budget management:
        - CRUD budget;
        - CRUD categories;
        - Create invitation key;
        - Join budget by invitation key;
        - Leave budget;
    - Balance tracking:
        - A user adds money to the budget;
        - A user subtracts money from a category;
        - A user sees a balance in the budget. Positive or negative, categories share;
    - Activity tracking:
        - A user sees who adds and who subtracts from the budget;
    - User management:
        - Sign in;
        - Sign up;
        - Profile review;
        - Profile visit;

    ### Remarks

    - A Budget HAS A Balance track;
        - A Balance IS A part of the Budget;
    - A User IS A Budget Owner OR A Member;
    - An Activity IS A history track, independent from User or Budget;

    ### Personas

    - **John**: Is a working student organizing a tour around Europe. He invites his friends Paul and Carla. John needs to track the expenses that might be divided between transportation, accommodation, food and drinks, and leisure activities like exhibitions and parties.
    - **Paul**: Is John’s younger cousin. Although he’s been saving some allowances, he is joining this trip to follow John. He adds some money to the budget, but not much. Mostly he has a bigger impulse for consuming.
    - **Carla**: Is a long friend of John’s and has been saving for a trip like that. She contributes a lot to the budget and has good control over what she takes from it.

    ### Use Cases

    - John, Paul, and Carla create a new account in GroupBudgify, informing their email, password, and full names.
    - After creating his account, John reviews his profile and updates his password.
    - After having their accounts created, Paul checks Carla’s profile in GroupBudgify.
    - John creates a new Budget called Euro Tour, adding the following categories: Transport, Accommodation, Foods and Drinks, and Leisure.
    - John acquires an invitation key from his new Budget and sends the key to Paul and Carla. Paul and Carla join the budget with the key.
    - John, Paul, and Carla add their initial contribution to the Budget, increasing its Balance.
    - During the trip, Paul surprises the group with a Wine Tasting in Venice.
    - Carla sees the Budget Balance getting negative, so she adds some extra money to it, making it positive again.
    - John oversees all the group’s activities as well as the date and time they happened.
    - Paul decides to cut the tour shorter and go home. Paul tries to leave the Budget, but it doesn’t allow it because Paul spent more than he added to the Budget Balance. John then removes Paul anyway, with his Budget Owner privileges.

    ### Model

    - **User**:
        - Email;
        - Password;
        - First Name
        - Last Name;
    - **Budget**:
        - Title;
        - Start Date;
        - End Date;
        - Owner;
        - Members;
        - **Categories (optional)**:
            - Label;
            - Description;
            - Expenses Share; - The percentage of expenses proportional in comparison to the other categories.
        - **Transaction Trails**:
            - Amount;
            - Member;
            - Category (optional);
            - Moment;
    - **Activity Record**:
        - Statement;
        - Impact: Positive | Negative | Neutral
        - Creation Date;

    ### Behaviors and invariants

    - User:
        - Signs in only if email and password are valid.
        - Signs up only if the email is unique.
        - Updates Password and Full Name.
        - Request Budget to create.
        - Request Budget to update.
        - Request Budget to delete.
        - Request Budget for a list of Budgets with Balances.
        - Request full details from one Budget.
        - Only request any operation if authenticated.
    - Budget:
        - Create new only if:
            - The Title is unique for that Owner.
            - The Title, Start, and End Date are provided.
        - Update only if:
            - Member is the Owner.
            - Title only if unique for that Owner.
            - Start Date only before it starts.
            - End Date only before it ends.
        - Request a Category to create only if the Member is Owner.
        - Request a Category to update only if the Member is Owner.
        - Request a Category to delete only if the Member is Owner.
        - Calculate the Expense Share of the Categories.
        - Request a Transaction Trail to create.
        - Triggers Activity Record after each change of state.
    - Budget Category:
        - Create, Retrieve, Update, Delete.
        - Triggers Activity Record after each change of state.
    - Budget Transaction Trail:
        - Create.
        - Triggers Activity Record after each change of state.
    - Activity Record:
        - Create when triggered.
    - *Date Pattern: String of dd/mm/yyyy.*
