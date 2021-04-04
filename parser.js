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

		vars: [['', '$$']],

		funcs: [['', '$$']],

		statements: [['', '$$']],

		id_helper: [
			['ID', '$$ = yytext'],
			['ID , id_helper', '$$ = $1'],
		],

		var_helper: [
			['id_helper : type', '$$ = $1'],
			['id_helper : type , var_helper', '$$ = $6'],
		],

		// vars: [['VAR var_helper ;', '$$ = $3']],

		assignment: [['ID = expression ;', '$$ = $3']],

		factor: [
			['( expression )', '$$ = $1'],
			['var_cte', '$$ = $1'],
			['+ var_cte', '$$ = $1'],
			['- var_cte', '$$ = $1'],
		],

		term_helper: [
			['* factor term_helper', '$$'],
			['/ factor term_helper', '$$'],
			['', '$$'],
		],

		term: [['factor term_helper', '$$']],

		exp_helper: [
			['+ term exp_helper', '$$'],
			['- term exp_helper', '$$'],
			['', '$$'],
		],

		exp: [['term exp_helper', '$$']],

		expression: [
			['exp', '$$ = $1'],
			['exp > exp', '$$ = $1 > $2'],
			['exp < exp', '$$ = $1 < $2'],
			['exp <> exp', '$$ = $1 != $2'],
		],

		wtg_helper: [
			[', expression wtg_helper', '$$'],
			[', CTE_STRING wtg_helper', '$$'],
			['', '$$'],
		],

		writing: [
			['PRINT ( expression wtg_helper ) ;', '$$'],
			['PRINT ( CTE_STRING wtg_helper ) ;', '$$'],
		],

		condition: [
			['IF ( expression ) block ;', '$$'],
			['IF ( expression ) block ; ELSE block ;', '$$'],
		],

		statute: [
			['assignment', '$$'],
			['condition', '$$'],
			['writing', '$$'],
		],

		block_hlpr: [
			['statute block_hlpr', '$$'],
			['', '$$'],
		],

		block: [
			['{ }', '$$'],
			['{ statute block_hlpr }', '$$'],
		],

		type: [
			['INT', '$$'],
			['FLOAT', '$$'],
			['CHAR', '$$'],
		],

		var_cte: [
			['ID', '$$ = yytext'],
			['FLOAT_CTE', '$$ = Number(yytext)'],
			['INT_CTE', '$$ = Number(yytext)'],
		],

		cte_string: [['CTE_STRING', '$$ = yytext']],
	},
}

const parser = new Parser(grammar)

// Correct input
const test1 = parser.parse('program prog1; main() {}')
console.log('TEST - General program structure (empty)')
console.log('--> ' + (test1 ? 'yes :)' : 'no :('))

const test2 = parser.parse(`
	program prog1; 
	class myClass1 { attributes <- -> methods <- -> } 
	main() {}`)
console.log('TEST - Class declarations (empty)')
console.log('--> ' + (test2 ? 'yes :)' : 'no :('))

const test3 = parser.parse(`
	program prog1; 
	class myClass1 extends myClass2 { attributes <- -> methods <- -> } 
	main() {}`)
console.log('TEST - Class declarations (empty) with father class')
console.log('--> ' + (test3 ? 'yes :)' : 'no :('))

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
