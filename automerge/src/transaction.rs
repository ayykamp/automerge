mod commit;
mod inner;
mod manual_transaction;
mod result;
mod transactable;

pub use self::commit::CommitOptions;
pub use self::transactable::Transactable;
pub(crate) use inner::TransactionInner;
pub use manual_transaction::Transaction;
pub use result::Failure;
pub use result::Success;

pub type Result<O, Obs, E> = std::result::Result<Success<O, Obs>, Failure<E>>;
