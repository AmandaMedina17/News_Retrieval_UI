"use client";

import { useState, useEffect, useRef } from "react";
import {
  User,
  Lock,
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

type AuthMode = "login" | "register";

interface AuthCardProps {
  onLogin?: (username: string) => void;
}

export function AuthCard({ onLogin }: AuthCardProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

  const loginPanelRef = useRef<HTMLDivElement>(null);
  const registerPanelRef = useRef<HTMLDivElement>(null);

  const TEST_USER = { username: "testuser", password: "123456" };

  useEffect(() => {
    setErrors({});
    setLoginError("");
  }, [mode]);

  // Medir altura de ambos paneles para evitar cambios de tamaño
  useEffect(() => {
    const measureHeights = () => {
      const loginHeight = loginPanelRef.current?.offsetHeight || 0;
      const registerHeight = registerPanelRef.current?.offsetHeight || 0;
      const maxHeight = Math.max(loginHeight, registerHeight);
      setContainerHeight(maxHeight);
    };
    measureHeights();
    window.addEventListener("resize", measureHeights);
    return () => window.removeEventListener("resize", measureHeights);
  }, [formData, errors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    setLoginError("");
  };

  const validateLogin = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username.trim()) newErrors.username = "Usuario requerido";
    if (!formData.password) newErrors.password = "Contraseña requerida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username.trim()) newErrors.username = "Usuario requerido";
    if (!formData.password) newErrors.password = "Contraseña requerida";
    if (formData.password.length < 6)
      newErrors.password = "Mínimo 6 caracteres";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      if (!validateLogin()) return;
      if (
        formData.username === TEST_USER.username &&
        formData.password === TEST_USER.password
      ) {
        onLogin?.(formData.username);
      } else {
        setLoginError("Usuario o contraseña incorrectos");
      }
    } else {
      if (!validateRegister()) return;
      alert("Registro exitoso. Ahora inicia sesión.");
      setMode("login");
      setFormData({ username: "", password: "", confirmPassword: "" });
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  };

  const handleGuestAccess = () => {
    onLogin?.("Invitado");
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
  };

  return (
    <div className=" flex justify-center px-4 pt-20 pb-12 md:pt-24">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border shadow-sm overflow-hidden rounded-lg">
          {/* Pestañas */}
          <div className="flex border-b border-border">
            <button
              onClick={() => switchMode("login")}
              className={`flex-1 py-4 text-sm font-semibold uppercase tracking-wide transition-all duration-200 ${
                mode === "login"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
              }`}
            >
              <LogIn className="inline-block w-4 h-4 mr-2 -mt-0.5" />
              Iniciar sesión
            </button>
            <button
              onClick={() => switchMode("register")}
              className={`flex-1 py-4 text-sm font-semibold uppercase tracking-wide transition-all duration-200 ${
                mode === "register"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
              }`}
            >
              <UserPlus className="inline-block w-4 h-4 mr-2 -mt-0.5" />
              Registrarse
            </button>
          </div>

          {/* Contenedor del slider con altura fija */}
          <div
            className="relative overflow-hidden transition-all duration-300"
            style={{
              height: containerHeight ? `${containerHeight}px` : "auto",
            }}
          >
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(${mode === "login" ? "0%" : "-100%"})`,
              }}
            >
              {/* Panel Login */}
              <div
                ref={loginPanelRef}
                className="w-full flex-shrink-0 p-6 md:p-8"
              >
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Bienvenido de nuevo
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                      Usuario
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors rounded-md"
                        placeholder="ej: testuser"
                      />
                    </div>
                    {errors.username && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.username}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-9 pr-10 py-2.5 text-sm bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors rounded-md"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                        aria-label={
                          showPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {loginError && (
                    <p className="text-sm text-destructive text-center">
                      {loginError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 mt-2 bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wide hover:bg-primary/90 transition-all"
                  >
                    Ingresar
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={handleGuestAccess}
                    className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group"
                  >
                    Continuar sin registrarse
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    Usuario de prueba:{" "}
                    <span className="font-mono">testuser</span> /{" "}
                    <span className="font-mono">123456</span>
                  </p>
                </div>
              </div>

              {/* Panel Registro */}
              <div
                ref={registerPanelRef}
                className="w-full flex-shrink-0 p-6 md:p-8"
              >
                <h2 className="font-serif text-2xl font-bold text-foreground mb-06">
                  Crear cuenta nueva
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                      Usuario
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors rounded-md"
                        placeholder="ej: usuario123"
                      />
                    </div>
                    {errors.username && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.username}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-9 pr-10 py-2.5 text-sm bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors rounded-md"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                        aria-label={
                          showPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                      Confirmar contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-9 pr-10 py-2.5 text-sm bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors rounded-md"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                        aria-label={
                          showConfirmPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 mt-2 bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wide hover:bg-primary/90 transition-all"
                  >
                    Registrarme
                  </button>
                </form>

                <div className="mt-6 p-3 bg-muted/30 border border-border rounded-md">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Con tu registro podemos ofrecerte una experiencia
                    personalizada con recomendaciones según tus búsquedas e
                    interacciones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
