import { useState, useEffect } from "react";

const API_BASE = "http://localhost:8080/produtos";

const initialForm = { nome: "", descricao: "", preco: "" };

export default function ProdutosApp() {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [searchNome, setSearchNome] = useState("");
  const [searchId, setSearchId] = useState("");
  const [foundProduto, setFoundProduto] = useState(null);
  const [tab, setTab] = useState("lista");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchByNome = async (nome) => {
    if (!nome.trim()) {
      setProdutos([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}?nome=${encodeURIComponent(nome)}`);
      const data = await res.json();
      setProdutos(data);
    } catch {
      showToast("Erro ao buscar produtos.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchById = async () => {
    if (!searchId.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${searchId}`);
      if (!res.ok) {
        setFoundProduto(null);
        showToast("Produto não encontrado.", "error");
        return;
      }
      const data = await res.json();
      setFoundProduto(data);
    } catch {
      showToast("Erro ao buscar produto.", "error");
    } finally {
      setLoading(false);
    }
  };

  const salvar = async () => {
    if (!form.nome || !form.preco) {
      showToast("Nome e preço são obrigatórios.", "error");
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        await fetch(`${API_BASE}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, preco: parseFloat(form.preco) }),
        });
        showToast("Produto atualizado!");
      } else {
        await fetch(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, preco: parseFloat(form.preco) }),
        });
        showToast("Produto salvo!");
      }
      setForm(initialForm);
      setEditingId(null);
      if (searchNome) fetchByNome(searchNome);
    } catch {
      showToast("Erro ao salvar produto.", "error");
    } finally {
      setLoading(false);
    }
  };

  const excluir = async (id) => {
    if (!confirm("Deseja excluir este produto?")) return;
    setLoading(true);
    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      showToast("Produto excluído!");
      setProdutos((prev) => prev.filter((p) => p.id !== id));
      if (foundProduto?.id === id) setFoundProduto(null);
    } catch {
      showToast("Erro ao excluir.", "error");
    } finally {
      setLoading(false);
    }
  };

  const editarProduto = (produto) => {
    setForm({
      nome: produto.nome,
      descricao: produto.descricao || "",
      preco: produto.preco,
    });
    setEditingId(produto.id);
    setTab("form");
  };

  return (
    <div style={styles.root}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <span style={styles.brandIcon}>📦</span>
          <span style={styles.brandName}>
            Produtos
            <br />
            <span style={styles.brandSub}>API Manager</span>
          </span>
        </div>
        <nav style={styles.nav}>
          {[
            { key: "lista", label: "Buscar por Nome", icon: "🔍" },
            { key: "id", label: "Buscar por ID", icon: "🎯" },
            {
              key: "form",
              label: editingId ? "Editar Produto" : "Novo Produto",
              icon: editingId ? "✏️" : "➕",
            },
          ].map((item) => (
            <button
              key={item.key}
              style={{
                ...styles.navBtn,
                ...(tab === item.key ? styles.navBtnActive : {}),
              }}
              onClick={() => setTab(item.key)}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={styles.sidebarFooter}>
          <span style={styles.footerDot} />
          <span style={{ color: "#94a3b8", fontSize: 12 }}>localhost:8080</span>
        </div>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        {/* Toast */}
        {toast && (
          <div
            style={{
              ...styles.toast,
              ...(toast.type === "error"
                ? styles.toastError
                : styles.toastSuccess),
            }}
          >
            {toast.type === "error" ? "⚠️" : "✅"} {toast.msg}
          </div>
        )}

        {/* TAB: Buscar por Nome */}
        {tab === "lista" && (
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Buscar Produtos por Nome</h2>
            <div style={styles.searchRow}>
              <input
                style={styles.input}
                placeholder="Digite o nome do produto..."
                value={searchNome}
                onChange={(e) => setSearchNome(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchByNome(searchNome)}
              />
              <button
                style={styles.btnPrimary}
                onClick={() => fetchByNome(searchNome)}
                disabled={loading}
              >
                {loading ? "..." : "Buscar"}
              </button>
            </div>

            {produtos.length > 0 && (
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      {["ID", "Nome", "Descrição", "Preço", "Ações"].map(
                        (h) => (
                          <th key={h} style={styles.th}>
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.map((p) => (
                      <tr key={p.id} style={styles.tr}>
                        <td style={styles.td}>
                          <code style={styles.code}>{p.id.slice(0, 8)}…</code>
                        </td>
                        <td style={styles.td}>
                          <strong>{p.nome}</strong>
                        </td>
                        <td style={styles.td}>
                          {p.descricao || (
                            <em style={{ color: "#94a3b8" }}>—</em>
                          )}
                        </td>
                        <td style={styles.td}>
                          <span style={styles.badge}>
                            R$ {Number(p.preco).toFixed(2)}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <button
                            style={styles.btnEdit}
                            onClick={() => editarProduto(p)}
                          >
                            Editar
                          </button>
                          <button
                            style={styles.btnDelete}
                            onClick={() => excluir(p.id)}
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {produtos.length === 0 && searchNome && !loading && (
              <div style={styles.empty}>
                Nenhum produto encontrado para "<strong>{searchNome}</strong>".
              </div>
            )}
            {!searchNome && (
              <div style={styles.empty}>
                Digite um nome e pressione <kbd style={styles.kbd}>Enter</kbd>{" "}
                ou clique em Buscar.
              </div>
            )}
          </div>
        )}

        {/* TAB: Buscar por ID */}
        {tab === "id" && (
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Buscar Produto por ID</h2>
            <div style={styles.searchRow}>
              <input
                style={styles.input}
                placeholder="Cole o UUID do produto..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchById()}
              />
              <button
                style={styles.btnPrimary}
                onClick={fetchById}
                disabled={loading}
              >
                {loading ? "..." : "Buscar"}
              </button>
            </div>

            {foundProduto && (
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardTitle}>{foundProduto.nome}</span>
                  <span style={styles.badge}>
                    R$ {Number(foundProduto.preco).toFixed(2)}
                  </span>
                </div>
                <p style={styles.cardDesc}>
                  {foundProduto.descricao || <em>Sem descrição</em>}
                </p>
                <p style={styles.cardId}>
                  <code style={styles.code}>{foundProduto.id}</code>
                </p>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button
                    style={styles.btnEdit}
                    onClick={() => editarProduto(foundProduto)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    style={styles.btnDelete}
                    onClick={() => excluir(foundProduto.id)}
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: Form */}
        {tab === "form" && (
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>
              {editingId ? "Editar Produto" : "Cadastrar Novo Produto"}
            </h2>
            {editingId && (
              <div style={styles.editBanner}>
                ✏️ Editando produto:{" "}
                <code style={styles.code}>{editingId}</code>
                <button
                  style={styles.cancelLink}
                  onClick={() => {
                    setEditingId(null);
                    setForm(initialForm);
                  }}
                >
                  Cancelar
                </button>
              </div>
            )}
            <div style={styles.formGrid}>
              <label style={styles.label}>
                Nome *
                <input
                  style={styles.input}
                  placeholder="Ex: Camiseta Azul"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                />
              </label>
              <label style={styles.label}>
                Preço (R$) *
                <input
                  style={styles.input}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ex: 49.90"
                  value={form.preco}
                  onChange={(e) => setForm({ ...form, preco: e.target.value })}
                />
              </label>
              <label style={{ ...styles.label, gridColumn: "1 / -1" }}>
                Descrição
                <textarea
                  style={{ ...styles.input, height: 90, resize: "vertical" }}
                  placeholder="Descrição opcional do produto..."
                  value={form.descricao}
                  onChange={(e) =>
                    setForm({ ...form, descricao: e.target.value })
                  }
                />
              </label>
            </div>
            <button
              style={styles.btnPrimary}
              onClick={salvar}
              disabled={loading}
            >
              {loading
                ? "Salvando..."
                : editingId
                  ? "💾 Atualizar"
                  : "✅ Cadastrar"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  root: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'IBM Plex Sans', sans-serif",
    background: "#0f172a",
    color: "#e2e8f0",
  },
  sidebar: {
    width: 230,
    background: "#1e293b",
    display: "flex",
    flexDirection: "column",
    padding: "28px 16px",
    borderRight: "1px solid #334155",
    flexShrink: 0,
  },
  brand: { display: "flex", alignItems: "center", gap: 12, marginBottom: 36 },
  brandIcon: { fontSize: 32 },
  brandName: {
    fontSize: 16,
    fontWeight: 700,
    lineHeight: 1.3,
    color: "#f1f5f9",
  },
  brandSub: {
    fontSize: 11,
    fontWeight: 400,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  nav: { display: "flex", flexDirection: "column", gap: 6, flex: 1 },
  navBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "none",
    border: "none",
    color: "#94a3b8",
    padding: "10px 12px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    textAlign: "left",
    transition: "all 0.15s",
  },
  navBtnActive: { background: "#0f172a", color: "#38bdf8", fontWeight: 600 },
  navIcon: { fontSize: 16, width: 20, textAlign: "center" },
  sidebarFooter: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 24,
  },
  footerDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#22c55e",
  },
  main: {
    flex: 1,
    padding: "40px 48px",
    overflowY: "auto",
    position: "relative",
  },
  panel: { maxWidth: 820 },
  panelTitle: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 24,
    color: "#f8fafc",
  },
  searchRow: { display: "flex", gap: 10, marginBottom: 24 },
  input: {
    flex: 1,
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#f1f5f9",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
  },
  btnPrimary: {
    background: "#38bdf8",
    color: "#0f172a",
    border: "none",
    borderRadius: 8,
    padding: "10px 22px",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
    flexShrink: 0,
  },
  tableWrap: {
    overflowX: "auto",
    borderRadius: 10,
    border: "1px solid #1e293b",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    background: "#1e293b",
    padding: "12px 14px",
    textAlign: "left",
    fontSize: 12,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tr: { borderBottom: "1px solid #1e293b" },
  td: { padding: "12px 14px", fontSize: 14, verticalAlign: "middle" },
  badge: {
    background: "#0f172a",
    color: "#38bdf8",
    border: "1px solid #38bdf8",
    borderRadius: 20,
    padding: "3px 10px",
    fontSize: 13,
    fontWeight: 600,
  },
  code: {
    fontFamily: "monospace",
    background: "#0f172a",
    padding: "2px 6px",
    borderRadius: 4,
    fontSize: 12,
  },
  btnEdit: {
    background: "none",
    border: "1px solid #334155",
    color: "#94a3b8",
    borderRadius: 6,
    padding: "5px 12px",
    cursor: "pointer",
    fontSize: 13,
    marginRight: 6,
  },
  btnDelete: {
    background: "none",
    border: "1px solid #ef4444",
    color: "#ef4444",
    borderRadius: 6,
    padding: "5px 12px",
    cursor: "pointer",
    fontSize: 13,
  },
  empty: { color: "#64748b", marginTop: 32, textAlign: "center", fontSize: 15 },
  kbd: {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 4,
    padding: "2px 7px",
    fontSize: 12,
    fontFamily: "monospace",
  },
  card: {
    background: "#1e293b",
    borderRadius: 12,
    padding: "20px 24px",
    border: "1px solid #334155",
    maxWidth: 480,
    marginTop: 8,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: { fontSize: 18, fontWeight: 700, color: "#f8fafc" },
  cardDesc: { color: "#94a3b8", fontSize: 14, marginBottom: 6 },
  cardId: { fontSize: 12, color: "#64748b" },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginBottom: 20,
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: 600,
  },
  editBanner: {
    background: "#1e3a5f",
    border: "1px solid #38bdf8",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    color: "#93c5fd",
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  cancelLink: {
    background: "none",
    border: "none",
    color: "#38bdf8",
    cursor: "pointer",
    fontSize: 13,
    textDecoration: "underline",
    marginLeft: "auto",
  },
  toast: {
    position: "fixed",
    top: 20,
    right: 24,
    padding: "12px 20px",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 14,
    zIndex: 999,
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
  },
  toastSuccess: {
    background: "#166534",
    color: "#86efac",
    border: "1px solid #22c55e",
  },
  toastError: {
    background: "#7f1d1d",
    color: "#fca5a5",
    border: "1px solid #ef4444",
  },
};
