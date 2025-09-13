import "./style.css";

import "./tailwind.css";
import type { JSX } from "solid-js";
import logoUrl from "../assets/logo.svg";
import { Link } from "../components/Link.js";

export default function LayoutDefault(props: { children?: JSX.Element }) {
  return <div>{props.children}</div>;
}
