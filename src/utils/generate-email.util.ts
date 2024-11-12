export function generateEmail(): string {
	return `teste.${Math.random().toString().split(".")[1]}@teste.com.br`;
}
