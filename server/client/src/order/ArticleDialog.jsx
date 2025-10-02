import {
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Box,
} from "@mui/material";
import Pagination from "../components/Pagination";
const ArticleDialog = ({
  openDialog,
  handleCloseDialog,
  shopData,
  selectImage,
  loading,
  page,
  setPage,
  totalPages,
}) => {
  return (
    <Dialog
      open={openDialog.open}
      onClose={handleCloseDialog}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Sélectionner un article</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress />
          </Box>
        ) : (
          <div className="columns-2 sm:columns-2 md:columns-3 gap-2">
            {shopData?.map((item, idx) => (
              <div
                key={idx}
                onClick={() =>
                  selectImage(
                    item.articleImage,
                    item.articleType,
                    item.articlePrice,
                    item._id
                  )
                }
                className="mb-2 break-inside-avoid cursor-pointer"
              >
                <img
                  src={item.articleImage}
                  alt="article"
                  style={{ width: "100%" }}
                />
              </div>
            ))}
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPrev={() => page > 1 && setPage(page - 1)}
          onNext={() => page < totalPages && setPage(page + 1)}
          isOrder={true}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ArticleDialog;
