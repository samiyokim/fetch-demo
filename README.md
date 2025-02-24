# Live Demo
[https://samiyokim.github.io/fetch-demo/](https://samiyokim.github.io/fetch-demo/)

# Demo
https://github.com/user-attachments/assets/9a62957d-5943-4ef3-8d2d-f090ab0610db


## Steps to Run Locally

### Clone the Repository
`git clone https://github.com/samiyokim/fetch-demo.git` 
[https://github.com/samiyokim/fetch-demo.git](https://github.com/samiyokim/fetch-demo.git)

## SETUP (Windows)
1. open a new Terminal
2. `cd .\fetch-demo`
3. `npm install`
4. `npm run dev`


## TEST
```bash
 ✓ src/components/__tests__/View.test.tsx (1 test) 165ms
   ✓ View Component > renders logout button after loading

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  21:18:17
   Duration  981ms
```

## TECH
---
| Technology     | Notes                         |
|----------------|-------------------------------|
| React          | A JavaScript library for building user interfaces. |
| React Router DOM     | Helps with routing pages. |
| Vite          | Easy build, generally more opinionated but quicker than webpack. |
| Tailwind          | Tame css, colocation issue with standarized class names |
| Radix-UI          | Reusable UI components. |
| Axios          | Help with client HTTP requests to BlockChair. |
| Vitest          | Testing framework |
| React-Testing-Library          | DOM and React component test helper |


### Misc:
| Technology     | Notes                         |
|----------------|-------------------------------|
| Insomnia          | This or POSTMAN, helps with API work |

## Further Thoughts
- Caching API call results
- Scalability: Enable larger API calls
- Filter by more search options: locations, name, etc.

- API - REST vs GraphQL
- automation - CI/CD using Jenkins - build on deploy, test suite
- monitoring - DataDog
- testing - Vitest and React Testing Library for client
