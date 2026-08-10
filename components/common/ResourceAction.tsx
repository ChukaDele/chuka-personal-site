"use client";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { useSound } from "../sound/SoundProvider";

type SharedProps = {
  children: ReactNode;
  className?: string;
  indicator?: "external" | "forward" | "down" | "download" | "none";
  variant?: "button" | "text" | "compact" | "plain";
  sound?: "resource" | "press" | "book" | "none";
};

type LinkProps = SharedProps & AnchorHTMLAttributes<HTMLAnchorElement> & {
  as?: "a";
  href: string;
};

type ButtonProps = SharedProps & ButtonHTMLAttributes<HTMLButtonElement> & {
  as: "button";
};

const indicators = {
  external: "↗",
  forward: "→",
  down: "↓",
  download: "↓",
  none: "",
};

export function ResourceAction(props: LinkProps | ButtonProps) {
  const { playBookCue, playInteractionCue } = useSound();
  const { children, className = "", indicator = "none", variant = "text", sound = "resource" } = props;
  const sharedClassName = `resource-action resource-action-${variant}${className ? ` ${className}` : ""}`;
  const content = <>{children}{indicator !== "none" ? <span className="resource-action-icon" aria-hidden="true">{indicators[indicator]}</span> : null}</>;
  const playSound = () => {
    if (sound === "book") playBookCue("open");
    else if (sound !== "none") playInteractionCue(sound);
  };

  if (props.as === "button") {
    const { as: _as, children: _children, indicator: _indicator, variant: _variant, sound: _sound, className: _className, type = "button", onClick, ...buttonProps } = props;
    void _as; void _children; void _indicator; void _variant; void _sound; void _className;
    return <button {...buttonProps} type={type} className={sharedClassName} data-resource-action onClick={(event) => { playSound(); onClick?.(event); }}>{content}</button>;
  }

  const { as: _as, children: _children, indicator: _indicator, variant: _variant, sound: _sound, className: _className, href, onClick, ...anchorProps } = props;
  void _as; void _children; void _indicator; void _variant; void _sound; void _className;
  const external = anchorProps.target === "_blank";
  return <a href={href} {...anchorProps} className={sharedClassName} data-resource-action onClick={(event) => { playSound(); onClick?.(event); }}>{content}{external ? <span className="sr-only"> (opens in a new tab)</span> : null}</a>;
}
