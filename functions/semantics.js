// Semantics
// Includes all semantic actions to be included in the parser
// Inputs: receives the oracle (semantic cube), the Stack and Queue data structures
// Output: does not return something since all actions are global
// Used by: parser.js (since it specifies the actions to be executed by it)

// Semantic cube
const oracle = require('./cube')
const Stack = require('./helpers/stack.js')
const Queue = require('./helpers/queue.js')

// Declare quadruples
let quads = new Queue()

// Declare all helper stacks
let operators = new Stack()
let operands = new Stack()
let jumps = new Stack()
let forStack = new Stack()

// Declare all helper counters
let res_count = 0

// -> Global semantic actions

// Declare function directory variable
func_directory = null

// Declare class directory variable
class_directory = null

// Variable to keep reference to global scope
global_func = null

// Semantic action that creates a new empty instance of the global function directory
// Does not receive any parameters
// Does not return anything
create_func_directory = function () {
	func_directory = new Map()
}

// Semantic action that adds the program name to the function directory and sets both the global and current function variables
// Receives the program name
// Does not return anything
add_program_id = (program_id) => {
	global_func = program_id
	current_func = program_id
	func_directory.set(program_id, { type: 'program', var_directory: new Map() })
}

// Semantic action that adds a function name to the global function directory, sets the current function variable and creates a new instance of a variable directory for the object
// Receives the function name
// Does not return anything
add_func_id = (func_id) => {
	current_func = func_id

	if (current_class != null) {
		// We are in a method declaration
		if (class_directory.get(current_class).method_directory.has(func_id)) {
			console.log('ERROR - Method already exists')
			throw 'ERROR - Method already exists'
		}
		class_directory.get(current_class).method_directory.set(func_id, {
			type: currentType,
			var_directory: new Map(),
		})
	} else {
		if (func_directory.has(func_id)) {
			console.log('ERROR - Function already exists')
			throw 'ERROR - Function already exists'
		}
		func_directory.set(func_id, { type: currentType, var_directory: new Map() })
	}
}

// Semantic action that sets the current type variable (for later use to add variable names)
// Receives the type
// Does not return anything
set_current_type = (type) => {
	currentType = type
}

// Semantic action that adds a variable name to the class or global function directory (depending on the previously set variables) and verifies it is not duplicated
// Receives the variable name
// Does not return anything
add_id = (id) => {
	is_id_duplicated(id)
	if (current_class != null) {
		// Adding var in class
		if (is_attr_dec) {
			class_directory
				.get(current_class)
				.attr_directory.set(id, { type: currentType })
		} else {
			// Is method declaration
			class_directory
				.get(current_class)
				.method_directory.get(current_func)
				.var_directory.set(id, { type: currentType })
		}
	} else {
		// Adding var in func / global var
		func_directory
			.get(current_func)
			.var_directory.set(id, { type: currentType })
	}
}

// Semantic action that adds an array variable name to the class or global function directory (depending on the previously set variables) and verifies it is not duplicated
// Receives the variable name and size of the array
// Does not return anything
add_id_array = (id, size) => {
	is_id_duplicated(id)
	if (current_class != null) {
		// Adding var in class
		if (is_attr_dec) {
			class_directory
				.get(current_class)
				.attr_directory.set(id, { type: `${currentType}[${size}]` })
		} else {
			// Is method declaration
			class_directory
				.get(current_class)
				.method_directory.get(current_func)
				.var_directory.set(id, { type: `${currentType}[${size}]` })
		}
	} else {
		func_directory
			.get(current_func)
			.var_directory.set(id, { type: `${currentType}[${size}]` })
		// console.log('received array with id = ' + id + ' and size of = ' + size)
		// console.log(func_directory.get(current_func).var_directory)
	}
}

// Semantic action that adds a matrix variable name to the class or global function directory (depending on the previously set variables) and verifies it is not duplicated
// Receives the variable name and size of the matrix (number of rows and columns)
// Does not return anything
add_id_matrix = (id, sizeR, sizeC) => {
	is_id_duplicated(id)
	if (current_class != null) {
		// Adding var in class
		if (is_attr_dec) {
			class_directory
				.get(current_class)
				.attr_directory.set(id, { type: `${currentType}[${sizeR}][${sizeC}]` })
		} else {
			// Is method declaration
			class_directory
				.get(current_class)
				.method_directory.get(current_func)
				.var_directory.set(id, { type: `${currentType}[${sizeR}][${sizeC}]` })
		}
	} else {
		func_directory.get(current_func).var_directory.set(id, {
			type: `${currentType}[${sizeR}][${sizeC}]`,
		})
		// console.log(
		// 	'received matrix with id = ' +
		// 		id +
		// 		' and sizeR of = ' +
		// 		sizeR +
		// 		' and sizeC of = ' +
		// 		sizeC
		// )
		// console.log(func_directory.get(current_func).var_directory)
	}
}

// Semantic action that marks the end of a function by setting the current function variable to the global function variable (the program's name)
// Does not receive any parameters
// Does not return anything
finish_func_dec = () => {
	current_func = global_func
}

// Semantic action that deletes the function directory after the program finishes and resets all the additional data structures used in the actions
// Does not receive any parameters
// Does not return anything
delete_func_directory = function () {
	console.log(func_directory)
	func_directory = null
	console.log('Quads before exit')
	print_quads(quads)
	quads = new Queue()
	operators = new Stack()
	operands = new Stack()
	jumps = new Stack()
	forStack = new Stack()
	res_count = 0
}

// -> Class semantic actions

// Semantic action that creates a new empty instance of a global class directory
// Does not receive any parameters
// Does not return anything
create_class_directory = () => {
	class_directory = new Map()
	current_class = null
}

// Semantic action that adds a class name to the class directory, sets the current class variable and creates new instances of both attribute and methods directory for the object
// Receives the class name
// Does not return anything
add_class_id = (class_id) => {
	current_class = class_id

	class_directory.set(class_id, {
		type: 'class',
		attr_directory: new Map(),
		method_directory: new Map(),
	})
}

// Semantic action that sets the flag to mark that attribute declarations for a class has started
// Does not receive any parameters
// Does not return anything
start_attributes_dec = () => {
	is_attr_dec = true
}

// Semantic action that sets the flag to mark that attribute declarations for a class has ended
// Does not receive any parameters
// Does not return anything
finish_attr_dec = () => {
	is_attr_dec = false
}

// Semantic action that sets the flag to mark that a class declaration has ended by setting the current class variable to null
// Does not receive any parameters
// Does not return anything
finish_class_dec = () => {
	current_class = null
}

// Semantic action that deletes the class directory after the program finishes
// Does not receive any parameters
// Does not return anything
delete_class_directory = () => {
	console.log('Class directory before exit')
	console.log(class_directory)
	class_directory = null
}

// -> Expressions semantic actions

// Semantic action that adds an operand to the operands stack by checking its type from either the class or global function directory
// Receives the operand and its type (which only specifies if it's a variable or not)
// Does not return anything
add_operand = (operand, type) => {
	if (type === 'var') {
		if (current_class != null) {
			const is_inside_class_method =
				class_directory
					.get(current_class)
					.method_directory.get(current_func)
					.var_directory.get(operand) != null
			// If variable is not inside the function variables, then it must be part of the class' attributes
			type = is_inside_class_method
				? class_directory
						.get(current_class)
						.method_directory.get(current_func)
						.var_directory.get(operand).type
				: class_directory.get(current_class).attr_directory.get(operand).type
		} else {
			// Search in current var_directory
			const is_inside_current_func =
				func_directory.get(current_func).var_directory.get(operand) != null

			// If not found, search in global scope
			const is_inside_global_scope =
				func_directory.get(global_func).var_directory.get(operand) != null

			if (is_inside_current_func) {
				type = func_directory.get(current_func).var_directory.get(operand).type
			} else if (is_inside_global_scope) {
				type = func_directory.get(global_func).var_directory.get(operand).type
			} else {
				type = 'undefined'
			}
		}
	}
	operands.push({ operand, type })
}

// Semantic action that adds an operator to the operators stack
// Receives the operator
// Does not return anything
add_operator = (operator) => {
	console.log('adding operator = ' + operator)
	operators.push(operator)
}

// Semantic action that generates the quadruple for either a multiplication or division operation by popping from both the operands and operators stack or throws if there's a type mismatch
// Does not receive any parameters
// Does not return anything
add_mult_div_operation = () => {
	console.log('inside add_mult_div_operation')
	if (operators.top() === '*' || operators.top() === '/') {
		const right = operands.pop()
		const right_operand = right.operand
		const left = operands.pop()
		const left_operand = left.operand
		const operator = operators.pop()

		const result_type = oracle(left.type, right.type, operator)

		if (result_type !== 'error') {
			const result = `temp${res_count++}`
			quads.push({ operator, left_operand, right_operand, result })
			operands.push({ operand: result, type: result_type })
		} else {
			console.log('ERROR - Type mismatch')
			throw 'ERROR - Type mismatch'
		}
	}
}

// Semantic action that generates the quadruple for either an addition or subtraction operation by popping from both the operands and operators stack or throws if there's a type mismatch
// Does not receive any parameters
// Does not return anything
add_sum_sub_operation = () => {
	console.log('inside add_sum_sub_operation')
	if (operators.top() === '+' || operators.top() === '-') {
		const right = operands.pop()
		const right_operand = right.operand
		const left = operands.pop()
		const left_operand = left.operand
		const operator = operators.pop()

		const result_type = oracle(left.type, right.type, operator)

		if (result_type !== 'error') {
			const result = `temp${res_count++}`
			quads.push({ operator, left_operand, right_operand, result })
			operands.push({ operand: result, type: result_type })
		} else {
			console.log('ERROR - Type mismatch')
			throw 'ERROR - Type mismatch'
		}
	}
}

// Semantic action that adds a false bottom (a left or starting parenthesis) to the operators stack to mark that a new subexpression has started
// Does not receive any parameters
// Does not return anything
start_subexpression = () => {
	console.log('inside start_subexpression')
	operators.push('(')
}

// Semantic action that removes the false bottom (a left or starting parenthesis) from the operators stack to mark that the subexpression has ended
// Does not receive any parameters
// Does not return anything
end_subexpression = () => {
	console.log('inside end_subexpression')
	operators.pop()
}

// Semantic action that generates the quadruple for all relational operations (<, >, !=, ==) by popping from both the operands and operators stack or throws if there's a type mismatch
// Does not receive any parameters
// Does not return anything
add_rel_operation = () => {
	console.log('inside add_rel_operation')
	if (
		operators.top() === '>' ||
		operators.top() === '<' ||
		operators.top() === '==' ||
		operators.top() === '!='
	) {
		const right = operands.pop()
		const right_operand = right.operand
		const left = operands.pop()
		const left_operand = left.operand
		const operator = operators.pop()

		const result_type = oracle(left.type, right.type, operator)

		if (result_type !== 'error') {
			const result = `temp${res_count++}`
			quads.push({ operator, left_operand, right_operand, result })
			operands.push({ operand: result, type: result_type })
		} else {
			console.log('ERROR - Type mismatch')
			throw 'ERROR - Type mismatch'
		}
	}
}

// Semantic action that generates the quadruple for the AND logical operation by popping from both the operands and operators stack or throws if there's a type mismatch
// Does not receive any parameters
// Does not return anything
add_and_operation = () => {
	console.log('inside add_and_operation')
	if (operators.top() === '&') {
		const right = operands.pop()
		const right_operand = right.operand
		const left = operands.pop()
		const left_operand = left.operand
		const operator = operators.pop()

		const result_type = oracle(left.type, right.type, operator)

		if (result_type !== 'error') {
			const result = `temp${res_count++}`
			quads.push({ operator, left_operand, right_operand, result })
			operands.push({ operand: result, type: result_type })
		} else {
			console.log('ERROR - Type mismatch')
			throw 'ERROR - Type mismatch'
		}
	}
}

// Semantic action that generates the quadruple for the OR logical operation by popping from both the operands and operators stack or throws if there's a type mismatch
// Does not receive any parameters
// Does not return anything
add_or_operation = () => {
	console.log('inside add_or_operation')
	if (operators.top() === '|') {
		const right = operands.pop()
		const right_operand = right.operand
		const left = operands.pop()
		const left_operand = left.operand
		const operator = operators.pop()

		const result_type = oracle(left.type, right.type, operator)

		if (result_type !== 'error') {
			const result = `temp${res_count++}`
			quads.push({ operator, left_operand, right_operand, result })
			operands.push({ operand: result, type: result_type })
		} else {
			console.log('ERROR - Type mismatch')
			throw 'ERROR - Type mismatch'
		}
	}
}

// -> IO semantic actions

// Semantic action that generates the quadruple for the printing operation of an expression by popping the operand to print from the operands stack
// Does not receive any parameters
// Does not return anything
print_expression = () => {
	console.log('inside print_expression')

	const operator = 'print'
	const res = operands.pop()
	const result = res.operand

	const left_operand = null
	const right_operand = null

	quads.push({ operator, left_operand, right_operand, result })
}

// Semantic action that generates the quadruple for the printing operation of a constant string
// Receives the string to print
// Does not return anything
print_string = (string) => {
	console.log('inside print_string')

	const operator = 'print'
	const result = string

	const left_operand = null
	const right_operand = null

	quads.push({ operator, left_operand, right_operand, result })
}

// Semantic action that generates the quadruple for the reading operation to a variable or throws if the given variable is not found within scope
// Receives the variable name
// Does not return anything
read_var = (variable) => {
	console.log('inside read_var')

	// if variable is within scope
	if (is_var_in_scope(variable)) {
		const operator = 'read'
		const result = variable

		const left_operand = null
		const right_operand = null

		quads.push({ operator, left_operand, right_operand, result })
	} else {
		console.log(`ERROR - "${variable}" not found within scope`)
		throw `ERROR - "${variable}" not found within scope`
	}
}

// Semantic action that generates the quadruple for the assignment of a variable by popping from both the operands and operators stack or throws if there's a type mismatch
// Does not receive any parameters
// Does not return anything
assign_exp = () => {
	console.log('inside assign_exp')

	const res = operands.pop()
	const result = res.operand

	const right_operand = null

	const left = operands.pop()
	const left_operand = left.operand

	const operator = operators.pop()

	console.log(res, left)
	if (res.type === left.type) {
		quads.push({
			operator,
			left_operand: result,
			right_operand,
			result: left_operand,
		})
	} else {
		console.log('ERROR - Type mismatch')
		throw 'ERROR - Type mismatch'
	}
}

// -> Control semantic actions

mark_if_condition = () => {
	console.log('inside mark_if_condition')

	const cond = operands.pop()
	if (cond.type !== 'int') {
		console.log('ERROR - Type mismatch')
		throw 'ERROR - Type mismatch'
	} else {
		const operator = 'gotoF'
		const left_operand = cond.operand
		const right_operand = null
		const result = 'pending'
		quads.push({ operator, left_operand, right_operand, result })
		jumps.push(quads.count - 1)
		//console.log(jumps)
	}
}

mark_if_end = () => {
	console.log('inside mark_if_end')

	const end = jumps.pop()
	quads.data[end].result = quads.count
}

mark_else = () => {
	console.log('inside mark_else')

	const false_jump = jumps.pop()

	const operator = 'goto'
	const left_operand = null
	const right_operand = null
	const result = 'pending'
	quads.push({ operator, left_operand, right_operand, result })

	jumps.push(quads.count - 1)

	quads.data[false_jump].result = quads.count
}

// -> Iteration semantic actions

mark_while_start = () => {
	console.log('inside mark_while_start')

	jumps.push(quads.count)
}

mark_while_condition = () => {
	console.log('inside mark_while_condition')

	const cond = operands.pop()
	if (cond.type !== 'int') {
		console.log('ERROR - Type mismatch')
		throw 'ERROR - Type mismatch'
	} else {
		const operator = 'gotoF'
		const left_operand = cond.operand
		const right_operand = null
		const result = 'pending'
		quads.push({ operator, left_operand, right_operand, result })
		jumps.push(quads.count - 1)
	}
}

mark_while_end = () => {
	console.log('inside mark_while_end')

	const false_jump = jumps.pop()
	const return_jump = jumps.pop()

	const operator = 'goto'
	const left_operand = null
	const right_operand = null
	const result = return_jump
	quads.push({ operator, left_operand, right_operand, result })

	quads.data[false_jump].result = quads.count
}

for_start_exp = () => {
	forStack.push(quads.data[quads.count - 1].result)
}

mark_until = () => {
	jumps.push(quads.count)
	add_operand(forStack.top(), 'var')
	add_operator('<')
	start_subexpression()
}

mark_for_condition = () => {
	end_subexpression()
	add_rel_operation()

	const cond = operands.pop()
	// No need to check cond type, HAS to be boolean
	const operator = 'gotoF'
	const left_operand = cond.operand
	const right_operand = null
	const result = 'pending'
	quads.push({ operator, left_operand, right_operand, result })
	jumps.push(quads.count - 1)
}

mark_for_end = () => {
	const varFor = forStack.pop()

	// generate quad --> { varFor = varFor + 1 }
	add_operand(varFor, 'var')
	add_operator('=')
	add_operand(varFor, 'var')
	add_operator('+')
	add_operand('1', 'int')
	add_sum_sub_operation()
	assign_exp()

	const false_jump = jumps.pop()
	const return_jump = jumps.pop()

	const operator = 'goto'
	const left_operand = null
	const right_operand = null
	const result = return_jump
	quads.push({ operator, left_operand, right_operand, result })
	quads.data[false_jump].result = quads.count
}

// -> Helper functions

// Function that checks if a variable name is already declared in the program
// Receives the id to check
// Does not return anything since it only throws if the name is duplicated
const is_id_duplicated = (id) => {
	if (current_class != null) {
		// We are in a class var declaration
		if (is_attr_dec) {
			// We are in attributes declaration
			if (class_directory.get(current_class).attr_directory.has(id)) {
				console.log('ERROR - Attribute already exists')
				throw 'ERROR - Attribute already exists'
			}
		} else {
			// Is in method declaration
			if (class_directory.get(current_class).method_directory.has(id)) {
				if (func_directory.get(current_func).var_directory.has(id)) {
					console.log('ERROR - Variable already exists in method')
					throw 'ERROR - Variable already exists in method'
				}
			}
		}
	} else {
		// We are in a func var/param or global var declaration
		// Check if id already exists
		if (func_directory.get(current_func).var_directory.has(id)) {
			console.log('ERROR - Variable already exists')
			throw 'ERROR - Variable already exists'
		}
	}
}

// Function that checks if a variable name is within scope (which means either the class directory in the current class or the global function directory in the current function contains it)
// Receives the variable name to check
// Returns true if variable is found within scope, false if not
is_var_in_scope = (variable) => {
	if (current_class != null) {
		// Search within class
		if (
			class_directory
				.get(current_class)
				.method_directory.get(current_func)
				.var_directory.has(variable)
		) {
			return true
		} else {
			return class_directory.get(current_class).attr_directory.has(variable)
		}
	} else {
		// Search in var_directory
		if (func_directory.get(current_func).var_directory.has(variable)) {
			return true
		} else {
			return func_directory.get(global_func).var_directory.has(variable)
		}
	}
}

// Function that prints the quadruples to the console
// Receives the quadruples
// Does not return anything since it only throws if the name is duplicated
print_quads = (quads) => {
	quads.data.forEach((value, index) => {
		console.log(`${index} - { ${get_single_quad_string(value)} }`)
	})
}

// Function that generates a user friendly string with the information inside a quadruple
// Receives the quadruple
// Returns the string
get_single_quad_string = (quad) => {
	let string = ''
	for (let [key, value] of Object.entries(quad)) {
		string += `${key}: ${value}     `
	}
	return string
}
