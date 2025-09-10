import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  /**
   * Validador de senha forte
   */
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null; // Deixar required validator lidar com campo vazio
      }

      const errors: ValidationErrors = {};

      // Verificar comprimento
      if (value.length < 8) {
        errors['minLength'] = { actualLength: value.length, requiredLength: 8 };
      }

      if (value.length > 128) {
        errors['maxLength'] = { actualLength: value.length, maxLength: 128 };
      }

      // Verificar caracteres necessários
      if (!/[a-z]/.test(value)) {
        errors['requiresLowercase'] = true;
      }

      if (!/[A-Z]/.test(value)) {
        errors['requiresUppercase'] = true;
      }

      if (!/\d/.test(value)) {
        errors['requiresNumber'] = true;
      }

      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        errors['requiresSpecialChar'] = true;
      }

      // Verificar senhas comuns
      const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'password123'];
      if (commonPasswords.some(common => value.toLowerCase().includes(common))) {
        errors['tooCommon'] = true;
      }

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }

  /**
   * Validador de nome completo
   */
  static fullName(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const trimmed = value.trim();

      if (trimmed.length < 2) {
        return { minLength: { actualLength: trimmed.length, requiredLength: 2 } };
      }

      if (trimmed.length > 100) {
        return { maxLength: { actualLength: trimmed.length, maxLength: 100 } };
      }

      // Verificar se contém pelo menos nome e sobrenome
      const words = trimmed.split(/\s+/).filter((word: string) => word.length > 0);
      if (words.length < 2) {
        return { fullNameRequired: true };
      }

      // Verificar caracteres válidos (apenas letras, espaços, acentos)
      const validNamePattern = /^[a-zA-ZÀ-ÿ\s]+$/;
      if (!validNamePattern.test(trimmed)) {
        return { invalidCharacters: true };
      }

      return null;
    };
  }

  /**
   * Obter mensagem de erro para validadores customizados
   */
  static getErrorMessage(fieldName: string, errors: ValidationErrors): string {
    if (errors['required']) {
      return `${fieldName} é obrigatório`;
    }

    if (errors['email']) {
      return 'Digite um email válido';
    }

    if (errors['minlength']) {
      return `${fieldName} deve ter pelo menos ${errors['minlength'].requiredLength} caracteres`;
    }

    if (errors['maxlength']) {
      return `${fieldName} deve ter no máximo ${errors['maxlength'].requiredLength} caracteres`;
    }

    // Erros de senha forte
    if (errors['requiresLowercase']) {
      return 'Senha deve conter pelo menos uma letra minúscula';
    }

    if (errors['requiresUppercase']) {
      return 'Senha deve conter pelo menos uma letra maiúscula';
    }

    if (errors['requiresNumber']) {
      return 'Senha deve conter pelo menos um número';
    }

    if (errors['requiresSpecialChar']) {
      return 'Senha deve conter pelo menos um caractere especial';
    }

    if (errors['tooCommon']) {
      return 'Senha muito comum, escolha uma senha mais segura';
    }

    // Erros de nome
    if (errors['fullNameRequired']) {
      return 'Digite nome e sobrenome';
    }

    if (errors['invalidCharacters']) {
      return 'Nome deve conter apenas letras';
    }

    // Erros de telefone
    if (errors['invalidPhoneFormat']) {
      return 'Telefone deve ter 10 ou 11 dígitos';
    }

    if (errors['invalidCellPhone']) {
      return 'Celular deve começar com 9';
    }

    // Erros de CPF
    if (errors['invalidCpfLength']) {
      return 'CPF deve ter 11 dígitos';
    }

    if (errors['invalidCpfSequence']) {
      return 'CPF não pode ter todos os dígitos iguais';
    }

    if (errors['invalidCpf']) {
      return 'CPF inválido';
    }

    // Erro de confirmação de senha
    if (errors['passwordMismatch']) {
      return 'Senhas não conferem';
    }

    return 'Campo inválido';
  }
}
