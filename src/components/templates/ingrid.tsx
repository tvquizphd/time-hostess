const Ingrid = ({ items, pushed, push }) => {
  return items.map(([text, cls], key) => {
    const p = ["", "pushed"][+(key == pushed)];
    const c = [ cls, ...p.split(" ") ];
    const className = c.join(" ");
    const onClick = () => push(key);
    const dProps = { key, className, onClick };
    return (
      <div {...dProps}>{text}</div>
    );
  });
}

export {
  Ingrid
}
