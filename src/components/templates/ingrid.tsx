const Ingrid = ({ items, pushed, push }) => {
  return items.map(([text, cls], key) => {
    const p = ["", "pushed"][+(key == pushed)];
    const c = [ cls, ...p.split(" ") ];
    const className = c.join(" ");
    const onClick = () => push(key);
    const dProps = { className, onClick };
    return (
      <div key={key} {...dProps}>{text}</div>
    );
  });
}

export {
  Ingrid
}
