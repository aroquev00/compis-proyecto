const Parser = require('jison').Parser

const grammar = {
	lex: {
		macros: {
			// Foundations
			digit: '[0-9]',
			digits: '{digit}+',
			letter: '[a-zA-Z]',
			letters: '{letter}+',

			// Spacing
			blank: ' ',
			tab: `\t`,
			newline: `\n`,
			whitespace: `\s`,
		},
		rules: [
			['\\s+', '/* skip whitespace */'],

			// General reserved words
			['program', "return 'PROGRAM'"],
			['main', "return 'MAIN'"],
			['var', "return 'VAR'"],

			// Class reserved words
			['class', "return 'CLASS'"],
			['extends', "return 'EXTENDS'"],
			['attributes', "return 'ATTRIBUTES'"],
			['methods', "return 'METHODS'"],

			// Function reserved words
			['func', "return 'FUNC'"],
			['return', "return 'RETURN'"],

			// Types
			['int', "return 'INT'"],
			['float', "return 'FLOAT'"],
			['char', "return 'CHAR'"],

			// IO
			['read', "return 'READ'"],
			['print', "return 'PRINT'"],

			// Control reserved words
			['if', "return 'IF'"],
			['else', "return 'ELSE'"],

			// Iteration reserved words
			['while', "return 'WHILE'"],
			['for', "return 'FOR'"],
			['until', "return 'UNTIL'"],

			// IDs
			['{letter}({letter}|{digit})*', "return 'ID'"],

			// Literals
			['{digits}\\.{digits}', "return 'FLOAT_CTE'"],
			['{digits}', "return 'INT_CTE'"],
			['\\"({letters}|{digits})+\\"', "return 'STRING_CTE'"],

			['\\<-', "return '<-'"],
			['\\->', "return '->'"],

			// Relational Operators
			['\\<', "return '<'"],
			['\\>', "return '>'"],
			['\\=', "return '='"],
			['\\==', "return '=='"],
			['\\!=', "return '!='"],
			['&', "return '&'"],
			['\\|', "return '|'"],

			// Arithmetic Operators
			['\\*', "return '*'"],
			['\\/', "return '/'"],
			['-', "return '-'"],
			['\\+', "return '+'"],

			// Brackets
			['\\(', "return '('"],
			['\\)', "return ')'"],
			['\\{', "return '{'"],
			['\\}', "return '}'"],
			['\\[', "return '['"],
			['\\]', "return ']'"],

			// Punctuation
			['\\:', "return ':'"],
			['\\;', "return ';'"],
			['\\,', "return ','"],
			['\\.', "return '.'"],

			['[{blank}{tab}{newline}{whitespace}]', "return 'WS'"],
			['$', "return 'EOF'"],

			['.', "return 'error'"],
		],
	},

	bnf: {
		initial: [['program', 'return $1']],

		program: [
			[
				'PROGRAM ID ; classes vars funcs MAIN ( ) { statements } EOF',
				'$$ = true',
			],
		],

		classes: [
			['CLASS ID { attributes methods }', '$$'],
			['CLASS ID EXTENDS ID { attributes methods }', '$$'],
			['', '$$'],
		],

		attributes: [['ATTRIBUTES <- vars ->', '$$']],

		methods: [['METHODS <- funcs ->', '$$']],

		vars: [
			['var vars', '$$'],
			['', '$$'],
		],

		var: [['VAR <- type id ids ; var_list ->', '$$']],

		var_list: [
			['type id ids ; var_list', '$$'],
			['', '$$'],
		],

		ids: [
			[', id ids', '$$'],
			['', '$$'],
		],

		id: [
			['ID', '$$'],
			['ID [ index ]', '$$'],
			['ID [ index ] [ index ]', '$$'],
		],

		index: [
			['ID', '$$'],
			['INT_CTE', '$$'],
		],

		type: [
			['INT', '$$'],
			['FLOAT', '$$'],
			['CHAR', '$$'],
			['ID', '$$'], // Class_name
		],

		funcs: [
			['func funcs', '$$'],
			['', '$$'],
		],

		func: [
			['FUNC ID ( params ) vars { func_statements }', '$$'],
			['return_type FUNC ID ( params ) vars { func_statements }', '$$'],
		],

		return_type: [
			['type', '$$'],
			['', '$$'], // void functions
		],

		params: [['vars', '$$']],

		func_statements: [
			['statements', '$$'],
			['RETURN expression ; func_statements', '$$'],
		],

		statements: [
			['statement statements', '$$'],
			['', '$$'],
		],

		statement: [
			['assignment', '$$'],
			['void_func_call', '$$'],
			['io', '$$'],
			['control', '$$'],
			['iteration', '$$'],
		],

		expression: [['ID', '$$']],

		assignment: [['var_name = expression ;', '$$']],

		var_name: [
			['id', '$$'],
			['id . id', '$$'],
		],

		void_func_call: [['', '$$']],

		io: [['', '$$']],

		control: [['', '$$']],

		iteration: [['', '$$']],

		// ---------------------------------------------------

		// id_helper: [
		// 	['ID', '$$ = yytext'],
		// 	['ID , id_helper', '$$ = $1'],
		// ],

		// var_helper: [
		// 	['id_helper : type', '$$ = $1'],
		// 	['id_helper : type , var_helper', '$$ = $6'],
		// ],

		// vars: [['VAR var_helper ;', '$$ = $3']],

		// assignment: [['ID = expression ;', '$$ = $3']],

		// factor: [
		// 	['( expression )', '$$ = $1'],
		// 	['var_cte', '$$ = $1'],
		// 	['+ var_cte', '$$ = $1'],
		// 	['- var_cte', '$$ = $1'],
		// ],

		// term_helper: [
		// 	['* factor term_helper', '$$'],
		// 	['/ factor term_helper', '$$'],
		// 	['', '$$'],
		// ],

		// term: [['factor term_helper', '$$']],

		// exp_helper: [
		// 	['+ term exp_helper', '$$'],
		// 	['- term exp_helper', '$$'],
		// 	['', '$$'],
		// ],

		// exp: [['term exp_helper', '$$']],

		// expression: [
		// 	['exp', '$$ = $1'],
		// 	['exp > exp', '$$ = $1 > $2'],
		// 	['exp < exp', '$$ = $1 < $2'],
		// 	['exp <> exp', '$$ = $1 != $2'],
		// ],

		// wtg_helper: [
		// 	[', expression wtg_helper', '$$'],
		// 	[', CTE_STRING wtg_helper', '$$'],
		// 	['', '$$'],
		// ],

		// writing: [
		// 	['PRINT ( expression wtg_helper ) ;', '$$'],
		// 	['PRINT ( CTE_STRING wtg_helper ) ;', '$$'],
		// ],

		// condition: [
		// 	['IF ( expression ) block ;', '$$'],
		// 	['IF ( expression ) block ; ELSE block ;', '$$'],
		// ],

		// statute: [
		// 	['assignment', '$$'],
		// 	['condition', '$$'],
		// 	['writing', '$$'],
		// ],

		// block_hlpr: [
		// 	['statute block_hlpr', '$$'],
		// 	['', '$$'],
		// ],

		// block: [
		// 	['{ }', '$$'],
		// 	['{ statute block_hlpr }', '$$'],
		// ],

		// var_cte: [
		// 	['ID', '$$ = yytext'],
		// 	['FLOAT_CTE', '$$ = Number(yytext)'],
		// 	['INT_CTE', '$$ = Number(yytext)'],
		// ],

		// cte_string: [['CTE_STRING', '$$ = yytext']],
	},
}

const parser = new Parser(grammar)

// Correct input

// Program
console.log('--------------\nProgram')
console.log('TEST - General program structure (empty)')
const test1 = parser.parse('program prog1; main() {}')
console.log('--> ' + (test1 ? 'yes :)' : 'no :('))

// Classes
console.log('--------------\nClasses')
console.log('TEST - Class declarations (empty)')
const test2 = parser.parse(`
	program prog1; 
	class myClass1 { attributes <- -> methods <- -> } 
	main() {}`)
console.log('--> ' + (test2 ? 'yes :)' : 'no :('))

console.log('TEST - Class declarations (empty) with father class')
const test3 = parser.parse(`
	program prog1; 
	class myClass1 extends myClass2 { attributes <- -> methods <- -> } 
	main() {}`)
console.log('--> ' + (test3 ? 'yes :)' : 'no :('))

// Variables
console.log('--------------\nVariables')
console.log('TEST - Vars declarations 1 var')
const test4 = parser.parse(`
	program prog1; 
	var <- int id1; -> 
	main() {}`)
console.log('--> ' + (test4 ? 'yes :)' : 'no :('))

console.log('TEST - Vars declarations n vars')
const test5 = parser.parse(`
	program prog1; 
	var <- int id1, id2; float id3; -> 
	main() {}`)
console.log('--> ' + (test5 ? 'yes :)' : 'no :('))

console.log('TEST - Vars declarations n vars with multi-dim vars')
const test6 = parser.parse(`
	program prog1; 
	var <- int id1, id2[1]; float id3, id4[n][m]; -> 
	main() {}`)
console.log('--> ' + (test6 ? 'yes :)' : 'no :('))

// Funcs
console.log('--------------\nFuncs')
console.log('TEST - Func declaration (empty)')
const test7 = parser.parse(`
	program prog1; 
	int func myFunc1 () { }
	main() {}`)
console.log('--> ' + (test7 ? 'yes :)' : 'no :('))

console.log('TEST - Void func declaration (empty)')
const test8 = parser.parse(`
	program prog1; 
	func myFunc1 () { }
	main() {}`)
console.log('--> ' + (test8 ? 'yes :)' : 'no :('))

console.log('TEST - Func declaration with parameters')
const test9 = parser.parse(`
	program prog1; 
	func myFunc1 (var <- int id1; ->) { }
	main() {}`)
console.log('--> ' + (test9 ? 'yes :)' : 'no :('))

console.log('TEST - Func declaration with parameters and statements')
const test10 = parser.parse(`
	program prog1; 
	func myFunc1 (var <- int id1; ->) { return id1; }
	main() {}`)
console.log('--> ' + (test10 ? 'yes :)' : 'no :('))

// Statements
console.log('--------------\nStatements\n')

// Assignment
console.log('--------------\nAssignment')
console.log('TEST - Assignment of simple variable')
const test11 = parser.parse('program prog1; main() { id1 = id1; }')
console.log('--> ' + (test11 ? 'yes :)' : 'no :('))

console.log('TEST - Assignment of variable of multi-dim struct')
const test12 = parser.parse('program prog1; main() { id1[1][n] = id1; }')
console.log('--> ' + (test12 ? 'yes :)' : 'no :('))

// Incorrect input
// const wrong_answer1 = parser.parse(
// 	'program 3hi; var id1, id2:float; {id1 = 1.1;}'
// )
// console.log('wrong answer 1 --> ' + wrong_answer1)

// const wrong_answer2 = parser.parse('prog someID;')
// console.log('wrong answer 2 --> ' + wrong_answer2)

// const wrong_answer3 = parser.parse('program prog3;')
// console.log('wrong answer 3 --> ' + wrong_answer3)
// program prog1; var id1, id2:float; { }
// program prog1; var id1, id2:int; {id1 = 1;}
