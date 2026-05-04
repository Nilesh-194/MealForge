export default function Spinner({ size='md' }) {
  const sizes = { sm:'20px', md:'40px', lg:'56px' };
  return (
    <div className="spinner" style={{width:sizes[size],height:sizes[size]}} />
  );
}