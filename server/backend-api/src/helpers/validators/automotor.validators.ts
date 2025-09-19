export class AutomotorValidators {

  static validateDominio(dominio: string): boolean {
    const regex = /^[A-Z]{3}[0-9]{3}$|^[A-Z]{2}[0-9]{3}[A-Z]{2}$/;
    return regex.test(dominio);
  }

  static validateFechaFabricacion(fecha: number): boolean {
    const fechaStr = fecha.toString();
    
   
    if (fechaStr.length !== 6) return false;
    
    const year = parseInt(fechaStr.substring(0, 4));
    const month = parseInt(fechaStr.substring(4, 6));
    
    
    if (year < 1900 || year > new Date().getFullYear()) return false;
    if (month < 1 || month > 12) return false;
    
    
    const now = new Date();
    const currentYearMonth = now.getFullYear() * 100 + (now.getMonth() + 1);
    
    return fecha <= currentYearMonth;
  }

}
