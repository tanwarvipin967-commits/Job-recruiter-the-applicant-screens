
import { useState } from "react";
import "./index.css";

const initialJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Apple",
    location: "Hyderabad",
    type: "Full-time",
    skills: "React, CSS, Tailwind CSS, Responsive Design",
    minSalary: "28000",
    maxSalary: "56000",
    description: "Build beautiful and responsive user interfaces using modern frontend technologies.",
    about: "Apple is looking for talented developers to join its frontend engineering team.",
    applicants: [],
  },
];

function App() {
  const [role, setRole] = useState("applicant");
  const [page, setPage] = useState("jobs");
  const [jobs, setJobs] = useState(initialJobs);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [filterType, setFilterType] = useState("Any type");
  const [profile, setProfile] = useState({
    name: "Rohit Jain",
    email: "rohitjaintrainer@gmail.com",
    image: "",
  });
  const [recruiter, setRecruiter] = useState({
    name: "Recruiter",
    email: "recruiter@gmail.com",
    image: "",
  });
  const [application, setApplication] = useState({
    coverLetter: "",
    resume: null,
  });
  const [notice, setNotice] = useState("");

  const emptyJob = {
    title: "",
    company: "",
    logo: "",
    about: "",
    location: "",
    type: "Full-time",
    skills: "",
    minSalary: "",
    maxSalary: "",
    description: "",
    applicants: [],
  };

  const [jobForm, setJobForm] = useState(emptyJob);

  const showNotice = (message) => {
    setNotice(message);
    setTimeout(() => setNotice(""), 2500);
  };

  const saveJob = (e) => {
    e.preventDefault();

    if (editingJob) {
      setJobs(jobs.map((job) =>
        job.id === editingJob.id
          ? { ...jobForm, id: editingJob.id, applicants: editingJob.applicants }
          : job
      ));
      showNotice("Job updated successfully!");
      setEditingJob(null);
    } else {
      setJobs([...jobs, { ...jobForm, id: Date.now(), applicants: [] }]);
      showNotice("Job published successfully!");
    }

    setJobForm(emptyJob);
  };

  const editJob = (job) => {
    setEditingJob(job);
    setJobForm({ ...job });
    setPage("post");
  };

  const deleteJob = (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      setJobs(jobs.filter((job) => job.id !== id));
      showNotice("Job deleted successfully!");
    }
  };

  const openJob = (job) => {
    setSelectedJob(job);
    setPage("details");
  };

  const submitApplication = (e) => {
    e.preventDefault();

    if (!application.resume) {
      showNotice("Please upload your resume.");
      return;
    }

    setJobs(jobs.map((job) =>
      job.id === selectedJob.id
        ? {
            ...job,
            applicants: [
              ...job.applicants,
              {
                id: Date.now(),
                name: profile.name,
                email: profile.email,
                coverLetter: application.coverLetter,
                resume: application.resume.name,
              },
            ],
          }
        : job
    ));

    setApplication({ coverLetter: "", resume: null });
    showNotice("Application submitted successfully!");
    setPage("jobs");
  };

  const filteredJobs = jobs.filter((job) => {
    const text = `${job.title} ${job.company} ${job.skills}`.toLowerCase();
    return (
      text.includes(search.toLowerCase()) &&
      job.location.toLowerCase().includes(location.toLowerCase()) &&
      (filterType === "Any type" || job.type === filterType)
    );
  });

  const currentProfile = role === "recruiter" ? recruiter : profile;
  const updateProfile = (key, value) => {
    const setter = role === "recruiter" ? setRecruiter : setProfile;
    setter((old) => ({ ...old, [key]: value }));
  };

  const changeRole = (newRole) => {
    setRole(newRole);
    setPage(newRole === "recruiter" ? "post" : "jobs");
    setSelectedJob(null);
    setEditingJob(null);
  };

  const allApplicants = jobs.reduce(
    (total, job) => total + job.applicants.length,
    0
  );

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand" onClick={() => setPage(role === "recruiter" ? "post" : "jobs")}>
          <span className="brand-icon">C</span>
          CareerNest<span className="brand-dot">.</span>
        </div>

        <nav>
          {role === "applicant" ? (
            <>
              <button onClick={() => setPage("jobs")} className={page === "jobs" ? "nav-active" : ""}>Find Jobs</button>
              <button onClick={() => setPage("profile")} className={page === "profile" ? "nav-active" : ""}>My Profile</button>
            </>
          ) : (
            <>
              <button onClick={() => { setPage("post"); setEditingJob(null); setJobForm(emptyJob); }} className={page === "post" ? "nav-active" : ""}>Post a Job</button>
              <button onClick={() => setPage("submissions")} className={page === "submissions" ? "nav-active" : ""}>Applications ({allApplicants})</button>
              <button onClick={() => setPage("profile")} className={page === "profile" ? "nav-active" : ""}>Profile</button>
            </>
          )}
        </nav>

        <select value={role} onChange={(e) => changeRole(e.target.value)} className="role-select">
          <option value="applicant">Applicant</option>
          <option value="recruiter">Recruiter</option>
        </select>
      </header>

      {notice && <div className="toast">{notice}</div>}

      <main className="main">
        {page === "post" && role === "recruiter" && (
          <div className="recruiter-layout">
            <section className="panel post-panel">
              <div className="eyebrow">JOB MANAGEMENT</div>
              <div className="panel-heading">
                <h2>{editingJob ? "Edit job post" : "Post a new role"}</h2>
                {editingJob && <button className="text-button" onClick={() => { setEditingJob(null); setJobForm(emptyJob); }}>Cancel edit</button>}
              </div>

              <form onSubmit={saveJob}>
                <div className="form-grid">
                  <Field label="Job title" value={jobForm.title} onChange={(v) => setJobForm({ ...jobForm, title: v })} required />
                  <Field label="Company name" value={jobForm.company} onChange={(v) => setJobForm({ ...jobForm, company: v })} required />
                  <Field label="Company logo URL (optional)" wide value={jobForm.logo} onChange={(v) => setJobForm({ ...jobForm, logo: v })} />
                  <Field label="About the company" wide textarea value={jobForm.about} onChange={(v) => setJobForm({ ...jobForm, about: v })} />
                  <Field label="Location" value={jobForm.location} onChange={(v) => setJobForm({ ...jobForm, location: v })} required />
                  <div className="field">
                    <label>Employment type</label>
                    <select value={jobForm.type} onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}>
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Internship</option>
                      <option>Contract</option>
                      <option>Remote</option>
                    </select>
                  </div>
                  <Field label="Skills (comma-separated)" wide value={jobForm.skills} onChange={(v) => setJobForm({ ...jobForm, skills: v })} />
                  <Field label="Minimum salary" type="number" value={jobForm.minSalary} onChange={(v) => setJobForm({ ...jobForm, minSalary: v })} />
                  <Field label="Maximum salary" type="number" value={jobForm.maxSalary} onChange={(v) => setJobForm({ ...jobForm, maxSalary: v })} />
                  <Field label="Role description" wide textarea value={jobForm.description} onChange={(v) => setJobForm({ ...jobForm, description: v })} required />
                </div>
                <button className="primary-button full-button">{editingJob ? "Save changes" : "Publish job"}</button>
              </form>
            </section>

            <section className="panel submissions-panel">
              <div className="eyebrow">APPLICATIONS</div>
              <h2>Job submissions</h2>
              <p className="muted">Choose a role to see its applicants.</p>
              <div className="job-manage-list">
                {jobs.map((job) => (
                  <div className="manage-job" key={job.id}>
                    <div>
                      <strong>{job.title}</strong>
                      <p>{job.company} · {job.location}</p>
                    </div>
                    <div className="manage-actions">
                      <button onClick={() => editJob(job)}>Edit</button>
                      <button onClick={() => { setSelectedJob(job); setPage("submissions"); }}>Submissions ({job.applicants.length})</button>
                      <button className="delete-button" onClick={() => deleteJob(job.id)}>Delete</button>
                    </div>
                  </div>
                ))}
                {jobs.length === 0 && <p className="muted">No jobs posted yet.</p>}
              </div>
            </section>
          </div>
        )}

        {page === "jobs" && role === "applicant" && (
          <section className="jobs-page">
            <div className="eyebrow">OPEN ROLES</div>
            <h1>Find your next opportunity</h1>
            <div className="search-bar">
              <input placeholder="Title, skill, or company" value={search} onChange={(e) => setSearch(e.target.value)} />
              <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option>Any type</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Contract</option>
                <option>Remote</option>
              </select>
              <button className="primary-button" onClick={() => {}}>Search</button>
            </div>

            <div className="job-results">
              <p className="muted">{filteredJobs.length} opportunities found</p>
              {filteredJobs.map((job) => (
                <article className="job-card" key={job.id} onClick={() => openJob(job)}>
                  <div className="company-logo">{job.company.slice(0, 2).toUpperCase()}</div>
                  <div className="job-card-content">
                    <h3>{job.title}</h3>
                    <p>{job.company} · {job.location}</p>
                    <span>{job.type}</span>
                  </div>
                  <span className="view-link">View role →</span>
                </article>
              ))}
              {filteredJobs.length === 0 && <div className="empty-state">No jobs found. Try another search.</div>}
            </div>
          </section>
        )}

        {page === "details" && role === "applicant" && selectedJob && (
          <section className="details-page">
            <button className="back-button" onClick={() => setPage("jobs")}>← All jobs</button>
            <div className="details-layout">
              <div className="details-content">
                <div className="details-heading">
                  <div className="company-logo large">{selectedJob.company.slice(0, 2).toUpperCase()}</div>
                  <div>
                    <div className="eyebrow">{selectedJob.type}</div>
                    <h1>{selectedJob.title}</h1>
                    <p>{selectedJob.company} · {selectedJob.location}</p>
                  </div>
                </div>
                <hr />
                <h2>About the role</h2>
                <p>{selectedJob.description}</p>
                <div className="skills">
                  {selectedJob.skills.split(",").filter(Boolean).map((skill, i) => <span key={i}>{skill.trim()}</span>)}
                </div>
                <hr />
                <h2>About {selectedJob.company}</h2>
                <p>{selectedJob.about || "Company information will be shared by the recruiter soon."}</p>
                <h2 className="salary-heading">Salary range</h2>
                <p>₹{selectedJob.minSalary || "Not specified"} – ₹{selectedJob.maxSalary || "Not specified"} / month</p>
              </div>

              <aside className="apply-card">
                <div className="eyebrow">INTERESTED?</div>
                <h2>Make your move.</h2>
                <p>Apply directly and keep track of your application from your workspace.</p>
                <form onSubmit={submitApplication}>
                  <label>Cover letter <span>(optional)</span></label>
                  <textarea rows="5" value={application.coverLetter} onChange={(e) => setApplication({ ...application, coverLetter: e.target.value })} />
                  <label>Résumé <span>PDF, DOC, or DOCX · 5 MB max</span></label>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setApplication({ ...application, resume: e.target.files[0] })} required />
                  <button className="primary-button full-button">Submit application</button>
                </form>
              </aside>
            </div>
          </section>
        )}

        {page === "profile" && (
          <section className="profile-page">
            <div className="eyebrow">YOUR ACCOUNT</div>
            <h1>Profile</h1>
            <p className="page-subtitle">Keep your details current to get the most from CareerNest.</p>
            <div className="panel profile-panel">
              <h2>Personal details</h2>
              <form onSubmit={(e) => { e.preventDefault(); showNotice("Profile saved successfully!"); }}>
                <Field label="Name" value={currentProfile.name} onChange={(v) => updateProfile("name", v)} required />
                <Field label="Email" type="email" value={currentProfile.email} onChange={(v) => updateProfile("email", v)} required />
                <div className="field">
                  <label>Profile image <span>optional · max 2 MB</span></label>
                  <input type="file" accept="image/*" onChange={(e) => updateProfile("image", e.target.files[0]?.name || "")} />
                </div>
                {currentProfile.image && <p className="muted">Selected image: {currentProfile.image}</p>}
                <button className="primary-button full-button">Save profile</button>
              </form>
            </div>
          </section>
        )}

        {page === "submissions" && role === "recruiter" && (
          <section className="submissions-page">
            <button className="back-button" onClick={() => setPage("post")}>← Back to job management</button>
            <div className="eyebrow">APPLICATIONS</div>
            <h1>Job submissions</h1>
            {jobs.map((job) => (
              <div className="panel applicant-panel" key={job.id}>
                <h2>{job.title}</h2>
                <p className="muted">{job.company} · {job.location}</p>
                {job.applicants.length === 0 ? (
                  <p>No applications received yet.</p>
                ) : job.applicants.map((applicant) => (
                  <div className="applicant-row" key={applicant.id}>
                    <div>
                      <strong>{applicant.name}</strong>
                      <p>{applicant.email}</p>
                      <p>{applicant.coverLetter || "No cover letter provided."}</p>
                      <span>Resume: {applicant.resume}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </section>
        )}
      </main>

      <footer>© 2026 CareerNest. Find work that moves you forward.</footer>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", textarea = false, wide = false, required = false }) {
  return (
    <div className={`field ${wide ? "wide" : ""}`}>
      <label>{label}</label>
      {textarea ? (
        <textarea rows="4" value={value} onChange={(e) => onChange(e.target.value)} required={required} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} />
      )}
    </div>
  );
}

export default App;