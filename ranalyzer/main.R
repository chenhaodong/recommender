library(tidyverse)
get_item_num_matrix <- function(myfile) {
  x <- read.csv('source_data.csv') %>% filter(!is.na(user_id) & user_id != 601)
  x$item_id <- as.character(x$item_id)
  x$user_id <- as.character(x$user_id)
  USER_IDS <- unique(x$user_id)
  ITEM_IDS <- unique(x$item_id)
  result <- matrix(0L, nrow = length(USER_IDS), ncol = length(ITEM_IDS))
  for (i in 1:nrow(x)) {
    row = which(USER_IDS == x$user_id[i])
    col = which(ITEM_IDS == x$item_id[i])
    result[row, col] = result[row, col] + 1L
  }
  for (i in 1:nrow(result)) {
    result[i, ] <- result[i, ] / sum(result[i, ])
  }
  invisible(list(result, USER_IDS, ITEM_IDS))
}
x <- get_item_num_matrix('source_data.csv')
USER_IDS <- x[[2L]]
ITEM_IDS <- x[[3L]]
record <- x[[1L]]
cor_item <- matrix(0, length(ITEM_IDS), length(ITEM_IDS))
cor_user <- matrix(0, length(USER_IDS), length(USER_IDS))
row_squares <- apply(record, 1L, function(x) sqrt(sum(x * x)))
col_squares <- apply(record, 2L, function(x) sqrt(sum(x * x)))
# for (i in seq_along(USER_IDS)) {
#   if (1 < i) {
#     for (j in 1:i) {
#       cor_user[i, j] <- sum(record[i, ] * record[j, ]) / (row_squares[i] * row_squares[j])
#     }
#   }
# }
# for (i in seq_along(USER_IDS)) {
#   if (i + 1 <= length(USER_IDS)) {
#     for (j in (i+1):(length(USER_IDS))) {
#       cor_user[i, j] <- cor_user[j, i]
#     }
#   }
# }
for (i in seq_along(ITEM_IDS)) {
  if (1 < i) {
    for (j in 1:i) {
      cor_item[i, j] <- sum(record[, i] * record[, j]) / (col_squares[i] * col_squares[j])
    }
  }
}
for (i in seq_along(ITEM_IDS)) {
  if (i + 1 <= length(ITEM_IDS)) {
    for (j in (i+1):(length(ITEM_IDS))) {
      cor_item[i, j] <- cor_item[j, i]
    }
  }
}
rownames(cor_item) <- ITEM_IDS
colnames(cor_item) <- ITEM_IDS
write.csv(cor_item, 'item.csv')
rownames(cor_user) <- USER_IDS
colnames(cor_user) <- USER_IDS
# write.csv(cor_user, 'user.csv')
recomnd_item <- character(length(ITEM_IDS))
find_top_n_position <- function(x, n) {
  d <- data.frame(a = 1:length(x), y = x) %>% arrange(desc(y))
  d$a[1:n]
}
result <- character(length(ITEM_IDS))
for (i in seq_along(ITEM_IDS)) {
  index <- find_top_n_position(cor_item[i, ], 6)
  x <- apply(record[, index], 1, max)
  if (max(x) == 0) {
    result[i] <- paste0(ITEM_IDS[i], ': no customer recommended')
  }
  else {
    cus <- USER_IDS[which(x > 0L)]
    result[i] <- paste0(ITEM_IDS[i], ': ', paste0(cus, collapse = ','))
  }
}
write_lines(result, 'result.txt')
