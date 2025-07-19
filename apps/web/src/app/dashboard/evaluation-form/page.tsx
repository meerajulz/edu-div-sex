"use client";
import { useState } from "react";
import { Question, questionsData } from "@/app/data/questions";
import { useRouter } from "next/navigation";
import DashboardWrapper from '../DashboardWrapper';

export default function Form() {
	// State to manage the questions
	const [questions, setQuestions] = useState<Question[]>(questionsData);

	// Router hook now used correctly
	const router = useRouter();

	// Handle TIPO DE APOYO change
	const handleSupportTypeChange = (id: number, value: "1" | "0") => {
		setQuestions((prev) =>
			prev.map((q) =>
				q.id === id
					? {
							...q,
							supportType: value,
							frequency: value === "1" ? null : q.frequency,
						}
					: q,
			),
		);
	};

	// Handle FRECUENCIA change
	const handleFrequencyChange = (id: number, value: "1" | "0") => {
		setQuestions((prev) =>
			prev.map((q) => (q.id === id ? { ...q, frequency: value } : q)),
		);
	};

	// Handle form submission
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// You might want to add validation here
		router.push("/home");
	};

	return (
		<DashboardWrapper>
			<div className="min-h-screen bg-neutral py-10 px-4">
			<div className="max-w-3xl mx-auto bg-white shadow-md rounded-md p-6">
				<h1 className="text-2xl font-bold mb-6">Evaluación de Nivel</h1>
				<form onSubmit={handleSubmit}>
					{questions.map((q) => (
						<div key={q.id} className="mb-6">
							{/* Question Text */}
							<label className="block text-lg font-medium mb-2">
								{q.question}
							</label>

							{/* TIPO DE APOYO (Checkboxes) */}
							<div className="flex gap-4 items-center">
								<label className="flex items-center gap-2">
									<input
										type="radio"
										name={`supportType-${q.id}`}
										value="1"
										checked={q.supportType === "1"}
										onChange={(e) =>
											handleSupportTypeChange(q.id, e.target.value as "1" | "0")
										}
										className="form-radio h-5 w-5 text-blue-500"
									/>
									Ninguno (1)
								</label>
								<label className="flex items-center gap-2">
									<input
										type="radio"
										name={`supportType-${q.id}`}
										value="0"
										checked={q.supportType === "0"}
										onChange={(e) =>
											handleSupportTypeChange(q.id, e.target.value as "1" | "0")
										}
										className="form-radio h-5 w-5 text-blue-500"
									/>
									Supervisión (0)
								</label>
							</div>

							{/* FRECUENCIA (Checkboxes, only visible if TIPO DE APOYO is 0) */}
							{q.supportType === "0" && (
								<div className="mt-4">
									<label className="block text-sm font-medium mb-2">
										Frecuencia
									</label>
									<div className="flex gap-4 items-center">
										<label className="flex items-center gap-2">
											<input
												type="radio"
												name={`frequency-${q.id}`}
												value="0"
												checked={q.frequency === "0"}
												onChange={(e) =>
													handleFrequencyChange(
														q.id,
														e.target.value as "1" | "0",
													)
												}
												className="form-radio h-5 w-5 text-green-500"
											/>
											A veces (0)
										</label>
										<label className="flex items-center gap-2">
											<input
												type="radio"
												name={`frequency-${q.id}`}
												value="1"
												checked={q.frequency === "1"}
												onChange={(e) =>
													handleFrequencyChange(
														q.id,
														e.target.value as "1" | "0",
													)
												}
												className="form-radio h-5 w-5 text-green-500"
											/>
											Siempre (1)
										</label>
									</div>
								</div>
							)}
						</div>
					))}

					{/* Submit Button */}
					<button
						type="submit"
						className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600"
					>
						Enviar
					</button>
				</form>
			</div>
			</div>
		</DashboardWrapper>
	);
}
