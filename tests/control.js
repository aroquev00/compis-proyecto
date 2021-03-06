// Control statements tests
// All tests to verify the declaration and use of control statements (if else)
// Inputs: receives the parser
// Output: does not return anything (only displays on console the results of the tests)
// Used by: all.js (calls all the test files)

const parser = require('../parser')

console.log('TEST 1 - Simple if (true)')
const test1 = parser.parse(`
	program prog1; 
    var <- float y; int x; ->

	main() {
        y = 2.5;
        x = 5;
        if(x > y) {
            x = 6;
        }
        y = 3.5;
    }`)
console.log('--> ' + (test1 ? 'yes :)' : 'no :('))

console.log('\nTEST 2 - Simple if (true) with print')
const test2 = parser.parse(`
	program prog1; 
    var <- float y; int x; ->

	main() {
        y = 2.5;
        x = 5;
        if(x > y) {
            print("inside if");
        }
        print("outside if");
    }`)
console.log('--> ' + (test2 ? 'yes :)' : 'no :('))

console.log('\nTEST 3 - Simple if (false) with print')
const test3 = parser.parse(`
	program prog1; 
    var <- float y; int x; ->

	main() {
        y = 2.5;
        x = 5;
        if(x > y) {
            print("inside if");
        }
        print("outside if");
    }`)
console.log('--> ' + (test3 ? 'yes :)' : 'no :('))

console.log('\nTEST 4 - Simple if else (true) with print')
const test4 = parser.parse(`
	program prog1; 
    var <- float y; int x; ->

	main() {
        y = 2.5;
        x = 5;
        if(x > y) {
            print("inside if");
        } else {
            print("inside else");
        }
        print("outside if");
    }`)
console.log('--> ' + (test4 ? 'yes :)' : 'no :('))

console.log('\nTEST 5 - Simple if else (false) with print')
const test5 = parser.parse(`
	program prog1; 
    var <- float y; int x; ->

	main() {
        y = 2.5;
        x = 5;
        if(x < y) {
            print("inside if");
        } else {
            print("inside else");
        }
        print("outside if");
    }`)
console.log('--> ' + (test5 ? 'yes :)' : 'no :('))

console.log('\nTEST 6 - Nested if else (true) with print')
const test6 = parser.parse(`
	program prog1; 
    var <- float y; int x; ->

	main() {
        y = 2.5;
        x = 5;
        if(x > y) {
            print("inside if");
            if(x == 5) {
                print("inside second if");
            }
            print("outside if");
        } else {
            print("inside else");
        }
        print("outside");
    }`)
console.log('--> ' + (test6 ? 'yes :)' : 'no :('))

console.log('\nTEST 7 - Nested if else (false) with print')
const test7 = parser.parse(`
	program prog1; 
    var <- float y; int x; ->

	main() {
        y = 2.5;
        x = 5;
        if(x < y) {
            print("inside if");
        } else {
            print("inside else");
            if(x == 5) {
                print("inside second if");
            }
            print("outside else if");
        }
        print("outside");
    }`)
console.log('--> ' + (test7 ? 'yes :)' : 'no :('))
