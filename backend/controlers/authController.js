import User from '../models/User.js';
import { sendEmailVerification, sendEmailPasswordReset } from '../emails/authEmailService.js';
import utils from '../utils/index.js';

const register = async (req, res) => {
    const { email, password, name } = req.body;

    // Validar que no falten campos o estén vacíos
    if ([email, password, name].some(field => !field || field.trim() === '')) {
        return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
    }

    try {
        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        // Validar la longitud de la contraseña
        if (password.trim().length < 6) {
            return res.status(400).json({ msg: 'La contraseña debe tener al menos 6 caracteres' });
        }

        // Crear y guardar el usuario
        const user = new User({ email, password, name });
        const result = await user.save();

        // Extraer el token generado y enviar el correo de verificación
        const { token } = result;
        await sendEmailVerification({ email, name, token });
        res.json({ msg: 'El Usuario se creó correctamente, revisa tu email' });
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ msg: 'Error al crear el usuario' });
    }
};

const verifyAccount = async (req, res) => {
    const { token } = req.params;
    try {
        // Buscar el usuario por el token
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(401).json({ msg: 'Token no válido' });
        }
        // Verificar si la cuenta ya está verificada
        if (user.verified) {
            return res.status(400).json({ msg: 'La cuenta ya esta verificada' });
        }
        // Marcar la cuenta como verificada
        user.verified = true;
        user.token = ''; // Limpiar el token
        // Guardar los cambios en la base de datos
        await user.save();
        res.json({ msg: 'Cuenta verificada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al verificar la cuenta,' });
    }
}
const login = async (req, res) => {
    const { email, password } = req.body;

    // Validar que no falten campos o estén vacíos
    if ([email, password].some(field => !field || field.trim() === '')) {
        return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
    }

    try {
        // Buscar el usuario por el email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: 'El usuario no existe' });
        }
        // Espera el resultado de comparePassword
        if (!(await user.comparePassword(password))) {
            return res.status(401).json({ msg: 'La contraseña es incorrecta' });
        }
        // Verificar si la cuenta no ha sido verificada
        if (!user.verified) {
            return res.status(401).json({ msg: 'La cuenta no ha sido verificada' });
        }
      
        // Generar el token JWT
        

        const token = utils.genereteJWT(user._id);
        res.json({ msg: 'Inicio de sesión exitoso', token });


    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ msg: 'Error al iniciar sesión' });
    }

   
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    // Validate email exists and is a string
    if (!email || typeof email !== 'string') {
        return res.status(400).json({ msg: 'El email es obligatorio y debe ser texto' });
    }

    // Now safely trim the email
    const trimmedEmail = email.trim();
    if (trimmedEmail === '') {
        return res.status(400).json({ msg: 'El email es obligatorio' });
    }

    try {
        const user = await User.findOne({ email: trimmedEmail });
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        
        // Generar nuevo token cada vez
        user.token = utils.uniqueID();
        const result = await user.save();

        // Enviar email con el nuevo token
        await sendEmailPasswordReset({ 
            email: result.email, 
            name: result.name, 
            token: result.token 
        });

        res.json({ msg: 'Hemos enviado un email con las instrucciones' });

    } catch (error) {
        return res.status(500).json({ msg: 'Error al procesar la solicitud' });
    }
};
const user = async (req, res) => {
    const { user } = req;
    if (!user) {
        return res.status(401).json({ msg: 'Usuario no encontrado' });
    }
    res.json(user);
}

const admin = async (req, res) => { 
    const { user } = req;
    if (!user) {
        return res.status(401).json({ msg: 'Usuario no encontrado' });
    }

    // Verificar si el usuario es administrador
    if (!user.admin) {
        return res.status(403).json({ msg: 'Accion no valida' });
    }
    res.json(user);
}


const verifyPasswordReset = async (req, res) => {
    const { token } = req.params;

    if (!token || token === 'undefined') {
        return res.status(400).json({ msg: 'Token no válido o no proporcionado' });
    }

    try {
        // Buscar usuario con token exacto y trim para eliminar espacios
        const user = await User.findOne({ token: token.trim() });
        
        if (!user) {
            return res.status(404).json({ msg: 'Token no válido o expirado' });
        }

        // Si encontramos el usuario, el token es válido
        return res.json({ msg: 'Token válido' });
    } catch (error) {
        console.error('Error al verificar token:', error);
        return res.status(500).json({ msg: 'Error al verificar el token' });
    }
};

const updatePassword = async (req, res) => {


    const { token } = req.params;
    const { password } = req.body;


    if (!token || token === 'undefined') {
   
        return res.status(400).json({ msg: 'Token no válido o no proporcionado' });
    }

    if (!password || password.trim() === '') {
        return res.status(400).json({ msg: 'La contraseña es obligatoria' });
    }

    try {

        // Buscar usuario con token exacto
        const user = await User.findOne({ token: token.trim() });
        
        if (!user) {

            return res.status(404).json({ msg: 'Token no válido o expirado' });
        }


        // Validar longitud mínima del password
        if (password.trim().length < 6) {

            return res.status(400).json({ msg: 'La contraseña debe tener al menos 6 caracteres' });
        }

 
        // Actualizar la contraseña
        user.password = password;
        user.token = ''; // Limpiar el token después de usar
        

        await user.save();


        res.json({ msg: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error('ERROR en actualización de contraseña:', error);
        console.error('Stack trace:', error.stack);
        return res.status(500).json({ msg: 'Error al actualizar la contraseña' });
    }
};



export { register, login, verifyAccount, user, forgotPassword, verifyPasswordReset, updatePassword, admin };