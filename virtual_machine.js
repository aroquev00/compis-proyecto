// Virtual machine
// Creates a virtual machine to execute all the intermediate code (quadruples generated by the semantics)
// Inputs: receives the quadruples from the parser (which includes the semantic actions)
// Output: prints in the console the outputs of the execution of quadruples
// Used by: ArrowScript.js

async function execute_virtual_machine(virtual_machine_info) {
	if (virtual_machine_info == null) {
		console.log('Expected information from parser inside virtual machine')
		throw 'Expected information from parser inside virtual machine'
	}

	const { quads, func_directory, constants_directory } = virtual_machine_info
}

module.exports = { execute_virtual_machine }