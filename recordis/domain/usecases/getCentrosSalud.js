// domain/usecases/getCentrosSalud.js
export async function fetchCentrosSalud() {
  const url = 'https://valencia.opendatasoft.com/api/explore/v2.1/catalog/datasets/hospitales/records';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al cargar centros de salud');
  const data = await res.json();

  return data.results ?? [];
}
