import { Test } from "@nestjs/testing";
import { Game, GamesRepositoryPort } from "../../../repositories/games.repository";
import { mock } from "jest-mock-extended";
import { GameGetByIdUseCasePort } from "./game-get-by-id.use-case";

describe("Test GameGetByIdUseCase", () => {
	beforeAll(async () => {
		await Test.createTestingModule({
			controllers: [],
			providers: [
				{ provide: "GameGetByIdUseCasePort", useValue: mock<GameGetByIdUseCasePort>() },
				{ provide: "GamesRepositoryPort", useValue: mock<GamesRepositoryPort>() },
			],
		}).compile();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should return a game by id with correct data", async () => {
		const mockGetGameByIdUseCase = mock<GameGetByIdUseCasePort>();
		const mockGame = mock<Game>();
		mockGetGameByIdUseCase.execute.mockResolvedValueOnce({ success: true, data: mockGame });

		const { success, data } = await mockGetGameByIdUseCase.execute(mockGame.id, process.env.API_KEY_ADMIN);

		expect(success).toBeTruthy();
		expect(data).toBe(mockGame);
	});
});
