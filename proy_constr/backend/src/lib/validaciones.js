export function esCorreoValido(email){
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return EMAIL_REGEX.test(String(email));
}

export function esContrasenaValida(password){
    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    return PASSWORD_REGEX.test(String(password));
}

function calcularDV(rutBody) {
  let sum = 0;
  let multiplicador = 2;

  for (let i = rutBody.length - 1; i >= 0; i -= 1) {
    sum += Number(rutBody[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = 11 - (sum % 11);

  if (resto === 11) {
    return "0";
  }

  if (resto === 10) {
    return "K";
  }

  return String(resto);
}

export function normalizeRut(rut){
    const original = String(rut).trim().toUpperCase().replace(/\./g, "");
    const compact = original.replace(/-/g, "");
    const tieneGuion = original.includes("-");
    let body = "";
    let providedDv = null;
  
    if (tieneGuion) {
      const [bodyPart, dvPart = ""] = original.split("-");
      body = bodyPart.replace(/\D/g, "");
      providedDv = dvPart.trim() ? dvPart.trim() : null;
    } else if (/^\d{7,8}$/.test(compact)) {
      body = compact;
    } else if (/^\d{8}K$/.test(compact)) {
      body = compact.slice(0, -1);
      providedDv = "K";
    } else if (/^\d{9}$/.test(compact)) {
      body = compact.slice(0, -1);
      providedDv = compact.slice(-1);
    } else {
      return null;
    }
  
    if (!/^\d{7,8}$/.test(body)) {
      return null;
    }
  
    if (providedDv && !/^[\dK]$/.test(providedDv)) {
      return null;
    }
  
    const calculatedDv = calcularDV(body);
  
    if (providedDv && providedDv !== calculatedDv) {
      return null;
    }
  
    return `${body}-${calculatedDv}`;
}