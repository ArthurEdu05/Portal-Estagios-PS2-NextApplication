'use client';

import React, { useState, useEffect } from 'react';

const PasswordStrengthMeter = ({ password }) => {
    const [strength, setStrength] = useState({
        score: 0,
        label: '',
        color: 'bg-gray-200',
        width: '0%',
    });

    const calculateStrength = (pass) => {
        let score = 0;
        const validations = {
            length: pass.length >= 8,
            number: /\d/.test(pass),
            lowercase: /[a-z]/.test(pass),
            uppercase: /[A-Z]/.test(pass),
            specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
        };

        if (validations.length) score++;
        if (validations.number) score++;
        if (validations.lowercase && validations.uppercase) score++;
        if (validations.specialChar) score++;

        if (pass.length > 0 && score === 0) score = 1; 

        let label = '';
        let color = 'bg-gray-200';
        let width = '0%';

        switch (score) {
            case 1:
                label = 'Fraca';
                color = 'bg-red-500';
                width = '25%';
                break;
            case 2:
                label = 'Média';
                color = 'bg-yellow-500';
                width = '50%';
                break;
            case 3:
                label = 'Boa';
                color = 'bg-blue-500';
                width = '75%';
                break;
            case 4:
                label = 'Forte';
                color = 'bg-green-500';
                width = '100%';
                break;
            default:
                label = '';
                color = 'bg-gray-200';
                width = '0%';
        }
        
        if (pass.length === 0) {
            label = '';
            width = '0%';
        }

        setStrength({ score, label, color, width });
    };

    useEffect(() => {
        calculateStrength(password);
    }, [password]);

    return (
        <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
                <p className={`text-sm font-medium ${
                    strength.score === 0 ? 'text-gray-500' : 
                    strength.score === 1 ? 'text-red-500' :
                    strength.score === 2 ? 'text-yellow-500' :
                    strength.score === 3 ? 'text-blue-500' : 'text-green-500'
                }`}>
                    Força da Senha: {strength.label}
                </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className={`h-2.5 rounded-full transition-all duration-300 ${strength.color}`}
                    style={{ width: strength.width }}
                ></div>
            </div>
            {password.length > 0 && password.length < 8 && (
                <p className="text-red-500 text-xs mt-1">
                    A senha deve ter pelo menos 8 caracteres.
                </p>
            )}
        </div>
    );
};

export default PasswordStrengthMeter;
