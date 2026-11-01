import { hrefToView, navigate } from "../nav";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; scroll?: boolean; prefetch?: boolean };

export default function Link({ href, scroll: _scroll, prefetch: _prefetch, onClick, children, ...rest }: Props) {
  const { name } = hrefToView(href);
  return (
    <a
      {...rest}
      href={`#${name}`}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </a>
  );
}
