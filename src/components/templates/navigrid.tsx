import styled from 'styled-components'

const Grid = styled.div`
  grid-template-columns: ${({reps}) => reps};
  justify-content: space-evenly;
  display: grid;
  gap: 0.5em;
  & > * {
    border: none;
    cursor: pointer;
    padding: 0.333em;
    text-align: center;
    border-radius: 0.4em;
    border-bottom: 0.4em groove rgba(55,55,55,.125);
    border-right: 0.3em inset rgba(255,255,255,.5);
    border-top: 0.4em outset rgba(255,255,255,.5);
  } 
  & > .pushed {
    border-bottom: 0.4em inset rgba(255,255,255,.5);
    border-left: 0.3em groove rgba(55,55,55,.125);
    border-top: 0.4em groove rgba(55,55,55,.125);
    border-right: none;
  }
`

const Navigrid = (props) => {
  const { children, n, w } = props;
  const gProps = {
    color: props.color,
    className: props.className,
    reps: `repeat(${n}, ${w})`
  }
  return <Grid {...gProps}>{children}</Grid>;
}

export {
  Navigrid
}
