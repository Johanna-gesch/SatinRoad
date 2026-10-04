namespace Infra;

public interface IRepository<T>
{
    void Insert(T entity);
    T? GetById(string id);
    void Update(T entity);
    void Delete(T entity);
    List<T> GetAll();
}