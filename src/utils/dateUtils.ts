export default function DateFormatter(isoString: string){
    const d = new Date(isoString);
    const yy = String(d.getFullYear() % 100).padStart(2, "0");     
    const mm = String(d.getMonth() + 1).padStart(2, "0");           
    const hh = String(d.getHours()).padStart(2, "0");               
    return `${d.getDate()}.${mm}.${yy} ${hh}:00`;
}

