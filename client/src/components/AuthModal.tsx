import React, { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext.tsx";
import { Check, Eye, EyeOff, Lock, Mail, Phone, User, X } from "lucide-react";
import Logo from "./Logo.tsx";
import BrewOverlay from "./BrewOverlay.tsx";
import {
    LIMITS,
    PASSWORD_RULES,
    passwordScore,
    validateEmail,
    validateLoginPassword,
    validateName,
    validatePassword,
    validatePhone,
} from "../lib/validation";

type FieldName = "name" | "email" | "password" | "phone";
type FieldErrors = Partial<Record<FieldName, string>>;

const BREW_DURATION = 2200;

export default function AuthModal() {
    const { isAuthModalOpen, setAuthModalOpen, login, register } =
        useAppContext();

    const [isLoginTab, setIsLoginTab] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [isOwner, setIsOwner] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>(
        {}
    );
    const [formError, setFormError] = useState("");
    const [formLoading, setFormLoading] = useState(false);
    const [brewing, setBrewing] = useState(false);
    const [brewName, setBrewName] = useState("");

    useEffect(() => {
        if (!isAuthModalOpen) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setAuthModalOpen(false);
            }
        };

        document.addEventListener("keydown", onKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = "";
        };
    }, [isAuthModalOpen, setAuthModalOpen]);

    const score = useMemo(() => passwordScore(password), [password]);

    if (!isAuthModalOpen && !brewing) return null;

    const validateField = (field: FieldName, value: string): string | null => {
        if (field === "name") return validateName(value);
        if (field === "email") return validateEmail(value);
        if (field === "phone") return validatePhone(value);
        return isLoginTab
            ? validateLoginPassword(value)
            : validatePassword(value);
    };

    const handleChange = (field: FieldName, value: string) => {
        if (field === "name") setName(value);
        if (field === "email") setEmail(value);
        if (field === "password") setPassword(value);
        if (field === "phone") setPhone(value);

        setFormError("");

        if (touched[field]) {
            setErrors((current) => ({
                ...current,
                [field]: validateField(field, value) ?? undefined,
            }));
        }
    };

    const handleBlur = (field: FieldName, value: string) => {
        setTouched((current) => ({ ...current, [field]: true }));
        setErrors((current) => ({
            ...current,
            [field]: validateField(field, value) ?? undefined,
        }));
    };

    const resetForm = () => {
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setIsOwner(false);
        setShowPassword(false);
        setErrors({});
        setTouched({});
        setFormError("");
    };

    const handleClose = () => {
        resetForm();
        setAuthModalOpen(false);
    };

    const switchTab = (loginTab: boolean) => {
        setIsLoginTab(loginTab);
        setErrors({});
        setTouched({});
        setFormError("");
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const nextErrors: FieldErrors = {};
        const emailError = validateEmail(email);
        const passwordError = isLoginTab
            ? validateLoginPassword(password)
            : validatePassword(password);

        if (emailError) nextErrors.email = emailError;
        if (passwordError) nextErrors.password = passwordError;

        if (!isLoginTab) {
            const nameError = validateName(name);
            const phoneError = validatePhone(phone);
            if (nameError) nextErrors.name = nameError;
            if (phoneError) nextErrors.phone = phoneError;
        }

        setErrors(nextErrors);
        setTouched({ name: true, email: true, password: true, phone: true });

        if (Object.keys(nextErrors).length > 0) {
            setFormError("Please fix the highlighted fields.");
            return;
        }

        setFormLoading(true);
        setFormError("");

        const result = isLoginTab
            ? await login(email.trim(), password)
            : await register(
                  name.trim(),
                  email.trim(),
                  password,
                  phone.trim() || undefined,
                  isOwner ? "owner" : "user"
              );

        setFormLoading(false);

        if (!result.ok) {
            setFormError(result.error || "Something went wrong. Try again.");
            return;
        }

        setBrewName(result.user?.name || name);
        setBrewing(true);
        resetForm();
        setAuthModalOpen(false);

        window.setTimeout(() => setBrewing(false), BREW_DURATION);
    };

    if (brewing) {
        return <BrewOverlay name={brewName} />;
    }

    const inputClass = (field: FieldName) =>
        `w-full border-b bg-transparent pb-1.5 pl-7 pt-1 text-sm transition-colors focus:outline-none ${
            errors[field]
                ? "border-error focus:border-error"
                : "border-outline-variant/60 focus:border-secondary"
        }`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-veil-in">
            <button
                type="button"
                className="absolute inset-0 cursor-default"
                onClick={handleClose}
                aria-label="Close dialog"
                tabIndex={-1}
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-label="Café Circle account"
                className="ambient-shadow relative z-10 flex max-h-[92vh] w-full max-w-sm flex-col overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container-lowest animate-modal-in lg:max-w-[22rem]"
            >
                <button
                    type="button"
                    onClick={handleClose}
                    className="absolute right-3.5 top-3.5 z-10 cursor-pointer text-on-surface/55 transition-colors hover:text-primary"
                    aria-label="Close café account dialog"
                >
                    <X size={18} />
                </button>

                <div className="flex shrink-0 border-b border-outline-variant/20">
                    <button
                        type="button"
                        onClick={() => switchTab(true)}
                        className={`flex-1 cursor-pointer py-3.5 text-center text-[11px] font-medium tracking-widest transition-colors ${
                            isLoginTab
                                ? "border-b-2 border-primary text-primary"
                                : "bg-surface-container-low/50 text-on-surface/55 hover:text-primary"
                        }`}
                    >
                        SIGN IN
                    </button>

                    <button
                        type="button"
                        onClick={() => switchTab(false)}
                        className={`flex-1 cursor-pointer py-3.5 text-center text-[11px] font-medium tracking-widest transition-colors ${
                            !isLoginTab
                                ? "border-b-2 border-primary text-primary"
                                : "bg-surface-container-low/50 text-on-surface/55 hover:text-primary"
                        }`}
                    >
                        SIGN UP
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="flex flex-col gap-4 overflow-y-auto px-6 py-5 lg:px-5 lg:py-4"
                >
                    <div className="text-center">
                        <Logo markOnly className="mx-auto h-9 text-secondary" />

                        <h2 className="mt-2.5 font-display text-xl font-medium tracking-tight text-primary">
                            {isLoginTab ? "Welcome back" : "Join Café Circle"}
                        </h2>

                        <p className="mt-1 text-[11px] leading-relaxed text-on-surface/55">
                            {isLoginTab
                                ? "Sign in to manage your café reservations."
                                : "Reserve your favourite seat in seconds."}
                        </p>
                    </div>

                    <div
                        key={isLoginTab ? "signin" : "signup"}
                        className="flex flex-col gap-3.5 animate-fields-in"
                    >
                        {!isLoginTab && (
                            <div>
                                <label
                                    htmlFor="auth-name"
                                    className="block text-left text-[10px] font-medium uppercase tracking-wider text-on-surface/55"
                                >
                                    Full name
                                    <span className="ml-0.5 text-error">*</span>
                                </label>

                                <div className="relative mt-1">
                                    <User
                                        size={15}
                                        className="absolute inset-y-0 left-0 my-auto text-on-surface/55"
                                    />

                                    <input
                                        id="auth-name"
                                        type="text"
                                        autoComplete="name"
                                        maxLength={LIMITS.nameMax}
                                        value={name}
                                        onChange={(event) =>
                                            handleChange(
                                                "name",
                                                event.target.value
                                            )
                                        }
                                        onBlur={(event) =>
                                            handleBlur("name", event.target.value)
                                        }
                                        placeholder="Sarah Jenkins"
                                        aria-required="true"
                                        aria-invalid={Boolean(errors.name)}
                                        className={inputClass("name")}
                                    />
                                </div>

                                {errors.name && (
                                    <p className="mt-1 text-[10px] text-error">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="auth-email"
                                className="block text-left text-[10px] font-medium uppercase tracking-wider text-on-surface/55"
                            >
                                Email address
                                <span className="ml-0.5 text-error">*</span>
                            </label>

                            <div className="relative mt-1">
                                <Mail
                                    size={15}
                                    className="absolute inset-y-0 left-0 my-auto text-on-surface/55"
                                />

                                <input
                                    id="auth-email"
                                    type="email"
                                    autoComplete="email"
                                    maxLength={LIMITS.emailMax}
                                    value={email}
                                    onChange={(event) =>
                                        handleChange("email", event.target.value)
                                    }
                                    onBlur={(event) =>
                                        handleBlur("email", event.target.value)
                                    }
                                    placeholder="you@example.com"
                                    aria-required="true"
                                    aria-invalid={Boolean(errors.email)}
                                    className={inputClass("email")}
                                />
                            </div>

                            {errors.email && (
                                <p className="mt-1 text-[10px] text-error">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {!isLoginTab && (
                            <div>
                                <label
                                    htmlFor="auth-phone"
                                    className="block text-left text-[10px] font-medium uppercase tracking-wider text-on-surface/55"
                                >
                                    Phone number (optional)
                                </label>

                                <div className="relative mt-1">
                                    <Phone
                                        size={15}
                                        className="absolute inset-y-0 left-0 my-auto text-on-surface/55"
                                    />

                                    <input
                                        id="auth-phone"
                                        type="tel"
                                        autoComplete="tel"
                                        maxLength={LIMITS.phoneMax}
                                        value={phone}
                                        onChange={(event) =>
                                            handleChange(
                                                "phone",
                                                event.target.value
                                            )
                                        }
                                        onBlur={(event) =>
                                            handleBlur(
                                                "phone",
                                                event.target.value
                                            )
                                        }
                                        placeholder="+60 12 345 6789"
                                        aria-invalid={Boolean(errors.phone)}
                                        className={inputClass("phone")}
                                    />
                                </div>

                                {errors.phone && (
                                    <p className="mt-1 text-[10px] text-error">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="auth-password"
                                className="block text-left text-[10px] font-medium uppercase tracking-wider text-on-surface/55"
                            >
                                Password
                                <span className="ml-0.5 text-error">*</span>
                            </label>

                            <div className="relative mt-1">
                                <Lock
                                    size={15}
                                    className="absolute inset-y-0 left-0 my-auto text-on-surface/55"
                                />

                                <input
                                    id="auth-password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete={
                                        isLoginTab
                                            ? "current-password"
                                            : "new-password"
                                    }
                                    maxLength={LIMITS.passwordMax}
                                    value={password}
                                    onChange={(event) =>
                                        handleChange(
                                            "password",
                                            event.target.value
                                        )
                                    }
                                    onBlur={(event) =>
                                        handleBlur(
                                            "password",
                                            event.target.value
                                        )
                                    }
                                    placeholder="••••••••"
                                    aria-required="true"
                                    aria-invalid={Boolean(errors.password)}
                                    className={`${inputClass("password")} pr-7`}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((shown) => !shown)
                                    }
                                    className="absolute inset-y-0 right-0 my-auto h-4 cursor-pointer text-on-surface/55 transition-colors hover:text-primary"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={15} />
                                    ) : (
                                        <Eye size={15} />
                                    )}
                                </button>
                            </div>

                            {isLoginTab && errors.password && (
                                <p className="mt-1 text-[10px] text-error">
                                    {errors.password}
                                </p>
                            )}

                            {!isLoginTab && (
                                <div className="mt-2">
                                    <div className="flex gap-1">
                                        {PASSWORD_RULES.map((rule, index) => (
                                            <span
                                                key={rule.id}
                                                className={`h-0.5 flex-1 rounded-full transition-colors ${
                                                    index < score
                                                        ? score === 4
                                                            ? "bg-secondary"
                                                            : "bg-on-surface/40"
                                                        : "bg-outline-variant/40"
                                                }`}
                                            />
                                        ))}
                                    </div>

                                    <ul className="mt-1.5 grid grid-cols-2 gap-x-2 gap-y-0.5">
                                        {PASSWORD_RULES.map((rule) => {
                                            const passed = rule.test(password);

                                            return (
                                                <li
                                                    key={rule.id}
                                                    className={`flex items-center gap-1 text-[10px] transition-colors ${
                                                        passed
                                                            ? "text-secondary"
                                                            : "text-on-surface/45"
                                                    }`}
                                                >
                                                    <Check
                                                        size={10}
                                                        strokeWidth={3}
                                                        className={
                                                            passed
                                                                ? "opacity-100"
                                                                : "opacity-25"
                                                        }
                                                    />
                                                    {rule.label}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {!isLoginTab && (
                            <div className="flex items-center gap-2.5">
                                <input
                                    type="checkbox"
                                    id="isOwner"
                                    checked={isOwner}
                                    onChange={(event) =>
                                        setIsOwner(event.target.checked)
                                    }
                                    className="h-3.5 w-3.5 cursor-pointer rounded border-outline-variant/60 accent-secondary"
                                />

                                <label
                                    htmlFor="isOwner"
                                    className="cursor-pointer select-none text-[11px] text-on-surface/55"
                                >
                                    I own or manage a café
                                </label>
                            </div>
                        )}
                    </div>

                    {formError && (
                        <p
                            role="alert"
                            className="rounded-sm border border-error/30 bg-error-container/40 px-3 py-2 text-[11px] text-error animate-shake"
                        >
                            {formError}
                        </p>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={formLoading}
                            className="w-full cursor-pointer bg-primary px-4 py-3 text-[11px] font-medium uppercase tracking-widest text-on-primary transition-colors hover:bg-secondary focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {formLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="h-3 w-3 animate-spin rounded-full border border-on-primary/30 border-t-on-primary" />
                                    Please wait
                                </span>
                            ) : isLoginTab ? (
                                "SIGN IN"
                            ) : (
                                "CREATE CAFÉ ACCOUNT"
                            )}
                        </button>

                        <p className="mt-2.5 text-center text-[10px] leading-relaxed text-on-surface/70">
                            <span className="text-error">*</span> Required. By
                            continuing you agree to our{" "}
                            <a href="#" className="underline hover:text-primary">
                                Terms of Service
                            </a>
                            .
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
