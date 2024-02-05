"use client";

import buttonStyles from "./button.module.scss";



export function Button({
  label,
  variant = "default",
  addOn,
  href,
  onClick = null,
  target,
  className,
}) {
  const buttonClasses = [buttonStyles.button];

  if (variant) {
    buttonClasses.push(buttonStyles["variant_" + variant]);
  }

  if (addOn) {
    buttonClasses.push(buttonStyles["addOn_" + addOn]);
  }

  return (
    <>
      {href && (
        <a
          href={href}
          target={target || "_self"}
          className={`${buttonClasses.join(" ")} ${className}`}
          onClick={onClick}
        >
          <span />{label}
        </a>
      )}
      {!href && !target && (
        <button
          className={`${buttonClasses.join(" ")} ${className}`}
          onClick={onClick}
          htmlFor={target}
        >
          <span />{label}
        </button >
      )
      }
      {!href && target && (
        <label
          className={`${buttonClasses.join(" ")} ${className}`}
          onClick={onClick}
          htmlFor={target}
        >
          <span />{label}
        </label >
      )
      }
    </>
  );
}
