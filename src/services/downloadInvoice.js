import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const downloadInvoice = async () => {
  const input = document.getElementById("invoice");

  const canvas = await html2canvas(input);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  pdf.save("invoice.pdf");
};

export default downloadInvoice;