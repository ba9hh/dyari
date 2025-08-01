import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function Pagination({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  isOrder = false,
}) {
  return (
    <div
      className={`relative flex flex-col gap-2 sm:gap-0 items-center sm:flex-row ${
        isOrder ? "sm:justify-between" : "sm:justify-center"
      } w-full mt-8`}
    >
      <div className="flex w-fit space-x-4">
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onPrev}
          disabled={currentPage === 1}
          size="small"
          sx={{
            textTransform: "none",
          }}
        >
          {" "}
          Previous page
        </Button>

        <Button
          variant="contained"
          // color="success"
          endIcon={<ArrowForwardIcon />}
          onClick={onNext}
          disabled={currentPage === totalPages}
          size="small"
          sx={{
            textTransform: "none",
          }}
        >
          Next page
        </Button>
      </div>
      <div className={`sm:absolute ${isOrder ? "right-0" : "right-8"}`}>
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1 border rounded">{currentPage}</div>
          <span className="text-gray-500">of {totalPages}</span>
          <div className="flex gap-1">
            <button
              onClick={onPrev}
              disabled={currentPage === 1}
              className={`p-1 bg-gray-100 hover:bg-gray-300 transition ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600"
              }`}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={onNext}
              disabled={currentPage === totalPages}
              className={`p-1 bg-gray-100 hover:bg-gray-300 transition ${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-800"
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
